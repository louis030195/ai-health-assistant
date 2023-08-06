import { createClient } from "@supabase/supabase-js";
import { Neurosity } from "@neurosity/sdk";
import { NextRequest, NextResponse } from "next/server";
import { OAuthQueryResult } from "@neurosity/sdk/dist/esm/types/oauth";
import { Database } from "@/types_db";

const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

const neurosity = new Neurosity({
    autoSelectDevice: false
});

export async function GET(req: NextRequest) {
    try {
        // Get all tokens from the database
        const { data: tokens, error: tokensError } = await supabase
            .from("tokens")
            .select("*")
            .eq("provider", "neurosity");

        if (tokensError) {
            return NextResponse.json({ error: tokensError.message }, { status: 500 });
        }

        // Loop over each token and refresh it
        for (let token of tokens) {
            let oauthResponse: OAuthQueryResult;
            try {
                oauthResponse = await neurosity.getOAuthToken({
                    clientId: process.env.NEUROSITY_OAUTH_CLIENT_ID!,
                    clientSecret: process.env.NEUROSITY_OAUTH_CLIENT_SECRET!,
                    userId: token.user_id,
                });
            } catch (error) {
                console.log(error)
                // remove token from table
                const { error: deleteError } = await supabase
                    .from("tokens")
                    .delete()
                    .eq("provider", "neurosity")
                    .eq("user_id", token.user_id);

                if (deleteError) {
                    console.log(deleteError)
                }

                continue;
            }

            // Update the token in the database
            const { error: updateError } = await supabase
                .from("tokens")
                .update({
                    // BUG keep old token bro
                    // token: oauthResponse, 
                    status: {
                        valid: true
                    }
                })
                .eq("provider", "neurosity")
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
