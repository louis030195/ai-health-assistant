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
        // Get all tokens from the database
        const { data, error: tokensError } = await supabase
            .from("tokens")
            .select()
            .eq("provider", "oura");

        if (tokensError) {
            return NextResponse.json({ error: tokensError.message }, { status: 500 });
        }

        // Loop over each token and refresh it
        for (const row of data) {
            let sleep: OuraSleep[] = []

            try {
                sleep = await listDailySleep(row.token)
            } catch (error) {
                console.log(error)

                // TODO SOMETHING

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
                .eq("user_id", row.user_id);

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

