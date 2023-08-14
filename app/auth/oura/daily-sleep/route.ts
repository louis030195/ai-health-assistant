import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";
import { OuraSleep, listDailySleep, renewOuraAccessToken } from "@/app/oura-server";
import * as Sentry from "@sentry/nextjs";

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

        console.log("Going to renew sleep for " + data.length + " users.");

        for (const row of data) {
            const { accessToken, refreshToken } = await renewOuraAccessToken(row.refresh_token!)
            console.log("Access token renewed for user: " + row.user_id, "at: " + new Date());

            // Check if today's entry already exists
            const { data: sleepData } = await supabase
                .from("states")
                .select()
                .eq("user_id", row.mediar_user_id)
                .eq("metadata->sleep->>day", localDate);

            // If entry exists, skip to next iteration
            if (sleepData && sleepData.length > 0) {
                console.log("Sleep already exists for user: " + row.user_id, "at: " + new Date());
                continue;
            }

            let sleep: OuraSleep[] = []

            try {
                sleep = await listDailySleep(accessToken)
            } catch (error) {
                console.log(error)
                Sentry.captureException(error);

                continue;
            }

            if (sleep.length === 0) {
                console.log("No sleep data for user: " + row.user_id, "data: " + sleep, "at: " + new Date());
                continue;
            }


            const { error: updateError } = await supabase
                .from("states")
                .upsert(sleep.map(s => ({
                    metadata: {
                        provider: "oura",
                        sleep: s as any
                    }, user_id: row.mediar_user_id!
                })))

            console.log("Sleep updated for user: " + row.user_id, "at: " + new Date());
            if (updateError) {
                console.log(updateError)
            }
        }

        return NextResponse.json({ message: "Sleeps renewed successfully." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// curl https://mediar.ai/auth/oura/daily-sleep
// or
// curl http://localhost:3000/auth/oura/daily-sleep

