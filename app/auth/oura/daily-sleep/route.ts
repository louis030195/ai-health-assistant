import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";
import { OuraSleep, listDailySleep } from "@/app/oura-server";

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
            .select()
            .eq("provider", "oura");

        if (tokensError) {
            return NextResponse.json({ error: tokensError.message }, { status: 500 });
        }

        for (const row of data) {
            // Check if today's entry already exists
            const { data: sleepData } = await supabase
                .from("states")
                .select()
                .eq("user_id", row.mediar_user_id)
                .eq("metadata->sleep->>day", localDate);

            // If entry exists, skip to next iteration
            if (sleepData && sleepData.length > 0) {
                continue;
            }

            let sleep: OuraSleep[] = []

            try {
                sleep = await listDailySleep(row.token)
            } catch (error) {
                console.log(error)

                // TODO SOMETHING

                continue;
            }

            if (sleep.length === 0) {
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
