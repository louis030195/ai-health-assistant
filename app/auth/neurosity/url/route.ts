import { Neurosity } from "@neurosity/sdk";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types_db'

const neurosity = new Neurosity({
    autoSelectDevice: false
});
// export const runtime = 'edge'
export async function GET(request: NextRequest) {
    return neurosity
        .createOAuthURL({
            clientId: process.env.NEUROSITY_OAUTH_CLIENT_ID!,
            clientSecret: process.env.NEUROSITY_OAUTH_CLIENT_SECRET!,
            redirectUri: process.env.NEUROSITY_OAUTH_CLIENT_REDIRECT_URI!,
            responseType: "token",
            state: Math.random().toString().split(".")[1], // A random string is required for security reasons
            scope: [
                "read:devices-info",
                "read:devices-status",
                "read:signal-quality",
                "read:brainwaves",
                "read:focus",
            ]
        })
        // .then((url) => NextResponse.redirect(url))
        .then((url) => NextResponse.json({url: url}))
        .catch((error) => NextResponse.json({ error: error.response.data }, { status: 400 }))
}