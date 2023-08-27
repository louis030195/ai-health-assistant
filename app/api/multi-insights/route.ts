import { Database } from '@/types_db';
import { getURL } from '@/utils/helpers';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  async function queueInsightTask(user: any) {
    const taskData = {
      userId: user.id,
      timezone: user.timezone,
      fullName: user.full_name,
      telegramChatId: user.telegram_chat_id
    };

    const baseUrl = getURL().replace(/\/$/, '')
    const url = baseUrl + '/api/single-insights'
    console.log("Queuing task for user:", user, "at url:", url);
    const response = await fetch('https://qstash.upstash.io/v1/publish/v1/publish/' + url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.QSTASH_TOKEN!,
        // 'Upstash-Forward-My-Header': 'my-value', // TODO: security
        'Upstash-Retries': '3',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error("Failed to queue task for user:", user, "with response:", responseData);
      throw new Error(responseData.message || "Failed to queue task");
    }

    console.log("Task queued successfully for user:", user);
  }

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  const { error, data: users } = await supabase
    .from('users')
    .select('id, timezone, full_name, telegram_chat_id')
    .gte('telegram_chat_id', '');

  if (error) {
    console.log("Error fetching users:", error.message);
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }

  // Assuming you want to process users who have a timezone and telegram_chat_id
  const filteredUsers = users?.filter((user) => user.timezone && user.telegram_chat_id) || [];

  await Promise.all(filteredUsers.map(async (user) => queueInsightTask(user)));

  return NextResponse.json({ message: "Tasks queued successfully" }, { status: 200 });
}

