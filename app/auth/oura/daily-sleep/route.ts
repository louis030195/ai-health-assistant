import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";
import { OuraDailySleep, OuraSleep, OuraWorkout, listDailySleep, listSleep, listWorkouts, renewOuraAccessToken } from "@/app/oura-server";

export const runtime = 'edge'
const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);
export async function GET(req: NextRequest) {

    // for each users, get their daily sleep and insert in the db

    try {
        const currentDate = new Date();
        const localDate = new Date(currentDate.valueOf() - currentDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];

        // Get all tokens from the database
        const { data, error: tokensError } = await supabase
            .from("tokens")
            .select("refresh_token,mediar_user_id,user_id")
            .eq("provider", "oura");

        if (tokensError) {
            return NextResponse.json({ error: tokensError.message }, { status: 500 });
        }

        console.log("Going to renew oura data for " + data.length + " users.");

        for (const row of data) {
            let accessToken: string;
            try {
                const tokens = await renewOuraAccessToken(supabase, row.refresh_token!, row.mediar_user_id!);
                accessToken = tokens.accessToken;
            } catch (error) {
                console.log(error)
                continue;
            }
            console.log("Access token renewed for user: " + row.mediar_user_id, "at: " + new Date());

            // Check if today's entry already exists
            const { data: sleepData } = await supabase
                .from("states")
                .select()
                .eq("user_id", row.mediar_user_id)
                .eq("oura->>day", localDate);

            // If entry exists, skip to next iteration
            if (sleepData && sleepData.length > 0) {
                console.log("Oura already exists for user: " + row.mediar_user_id, "at: " + new Date());
                continue;
            }

            let dailySleep: OuraDailySleep[] = []
            let sleep: OuraSleep[] = []
            let workout: OuraWorkout[] = []

            try {
                dailySleep = await listDailySleep(accessToken)
            } catch (error) {
                console.log(error)

                continue;
            }

            try {
                sleep = await listSleep(accessToken)
            } catch (error) {
                console.log(error)

                continue;
            }
            try {
                workout = await listWorkouts(accessToken)
            } catch (error) {
                console.log(error)

                return NextResponse.json({ error: error }, { status: 500 });
            }
            if (sleep.length === 0 && dailySleep.length === 0 && workout.length === 0) {
                console.log("No Oura data for user: " + row.user_id, "at: " + new Date());
                continue;
            }

            const { error: updateError } = await supabase
                .from("states")
                .upsert({
                    user_id: row.mediar_user_id!,
                    oura: {
                        measurement_date: localDate,
                        day: localDate,
                        daily_sleep: dailySleep,
                        sleep: sleep,
                        workout: workout
                    } as any
                })

            if (updateError) {
                console.log(updateError)
            }
            console.log("Oura updated for user: " + row.user_id, "at: " + new Date());
        }

        return NextResponse.json({ message: "Sleeps renewed successfully." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// curl https://mediar.ai/auth/oura/daily-sleep
// or
// curl http://localhost:3000/auth/oura/daily-sleep

