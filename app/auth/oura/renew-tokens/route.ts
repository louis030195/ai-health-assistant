import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";

const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);
export const runtime = 'edge'

// API endpoint 
const TOKEN_URL = 'https://api.ouraring.com/oauth/token';

export async function GET(req: NextRequest) {
    try {
        // Get all tokens from the database
        const { data: tokens, error: tokensError } = await supabase
            .from("tokens")
            .select("*")
            .eq("provider", "oura");

        if (tokensError) {
            return NextResponse.json({ error: tokensError.message }, { status: 500 });
        }

        // Loop over each token and refresh it
        for (let token of tokens) {
            let newToken = ''
            try {
                const response = await fetch(TOKEN_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_OURA_OAUTH_CLIENT_ID!}:${process.env.OURA_OAUTH_CLIENT_SECRET!}`).toString('base64')}`
                    },
                    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(token.refresh_token!)}`
                })

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Failed to renew OAuth token: ${response.status} ${response.statusText} ${text}`);
                }

                const data = await response.json();
                newToken = data.access_token
            } catch (error) {
                console.log(error)
                // remove token from table
                // const { error: deleteError } = await supabase
                //     .from("tokens")
                //     .delete()
                //     .eq("provider", "oura")
                //     .eq("user_id", token.user_id);

                // if (deleteError) {
                //     console.log(deleteError)
                // }

                continue;
            }

            // Update the token in the database
            const { error: updateError } = await supabase
                .from("tokens")
                .update({
                    token: newToken,
                    status: {
                        valid: true
                    }
                })
                .eq("provider", "oura")
                .eq("user_id", token.user_id);

            console.log("Token updated for user: " + token.user_id, "at: " + new Date());
            if (updateError) {
                console.log(updateError)
            }
        }

        return NextResponse.json({ message: "Tokens renewed successfully." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// curl https://mediar.ai/auth/oura/renew-tokens
// or
// curl http://localhost:3000/auth/oura/renew-tokens