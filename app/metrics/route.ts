import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types_db";

export const runtime = 'edge'
const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);
export async function GET(req: NextRequest) {

}


