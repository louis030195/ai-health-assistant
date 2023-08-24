import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";
import { OuraDailySleep, OuraSleep, OuraWorkout, listDailySleep, listSleep, listWorkouts, renewOuraAccessToken } from "@/app/oura-server";
import * as Sentry from "@sentry/nextjs";
import { kv } from '@vercel/kv'
import { H } from '@highlight-run/next/server'
export const runtime = 'edge'
const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);
export async function POST(req: NextRequest) {
    // get userId from body 
    const { userId, date } = await req.json()
    // Check if today's entry already exists
    const { data: sleepData } = await supabase
        .from("states")
        .select()
        .eq("user_id", userId)
        .eq("oura->>day", date);

    // If entry exists, skip to next iteration
    if (sleepData && sleepData.length > 0) {
        console.log("Oura already exists for user: " + userId, "at: " + new Date());
        return NextResponse.json({ message: "Oura data already exists for user: " + userId }, { status: 200 });
    }
    try {

        const { data: row, error: tokensError } = await supabase
            .from("tokens")
            .select("refresh_token,mediar_user_id,user_id")
            .eq("mediar_user_id", userId)
            .eq("provider", "oura")
            .single();

        if (tokensError) {
            return NextResponse.json({ error: tokensError.message }, { status: 500 });
        }

        console.log("Going to renew oura data for " + row.user_id + " users.");

        let accessToken: string;
        try {
            const tokens = await renewOuraAccessToken(supabase, row.refresh_token!, row.mediar_user_id!);
            accessToken = tokens.accessToken;
        } catch (error) {
            console.log(error)
            Sentry.captureException(error);
            return NextResponse.json({ error: error }, { status: 500 });
        }
        console.log("Access token renewed for user: " + row.mediar_user_id, "at: " + new Date());

        let dailySleep: OuraDailySleep[] = []
        let sleep: OuraSleep[] = []
        let workout: OuraWorkout[] = []
        // Get previous date for listSleep
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateString = prevDate.toISOString().split('T')[0];

        try {
            dailySleep = await listDailySleep(accessToken, date, date)
        } catch (error) {
            console.log(error)
            Sentry.captureException(error);

            return NextResponse.json({ error: error }, { status: 500 });
        }

        try {
            sleep = await listSleep(accessToken, prevDateString, date)
        } catch (error) {
            console.log(error)
            Sentry.captureException(error);

            return NextResponse.json({ error: error }, { status: 500 });
        }

        try {
            workout = await listWorkouts(accessToken, prevDateString, date)
        } catch (error) {
            console.log(error)
            Sentry.captureException(error);

            return NextResponse.json({ error: error }, { status: 500 });
        }

        if (sleep.length === 0 && dailySleep.length === 0 && workout.length === 0) {
            console.log("No Oura data for user: " + row.user_id, "at: " + new Date());
            return NextResponse.json({ message: "No Oura data for user: " + row.user_id }, { status: 200 });
        }
        const { error: updateError } = await supabase
            .from("states")
            .upsert({
                user_id: row.mediar_user_id!,
                oura: {
                    day: date,
                    daily_sleep: dailySleep,
                    sleep: sleep,
                    workout: workout
                } as any
            })

        if (updateError) {
            console.log(updateError)
        }
        console.log("Oura updated for user: " + row.user_id, "at: " + new Date());

        return NextResponse.json({ message: "Sleeps renewed successfully." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// curl https://mediar.ai/auth/oura/daily-sleep
// or
// curl http://localhost:3000/auth/oura/daily-sleep

