import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const { verification_token, challenge } = Object.fromEntries(searchParams.entries());

    console.log({ verification_token, challenge })
    // Verify verification_token 
    if (!verification_token) {
        return NextResponse.json({ error: 'Verification token required' }, { status: 400 })
    }

    // Return challenge to prove ownership of endpoint
    return NextResponse.json({ challenge: challenge }, { status: 200 })
}