import { Database } from '@/types_db';
import { getURL } from '@/utils/helpers';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    async start(controller) {
      const supabase = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
      )
      const { error, data: users } = await supabase
        .from('users')
        .select('id, timezone, full_name, telegram_chat_id, phone, goal')
        .gte('telegram_chat_id', '');

      if (error) {
        controller.enqueue(encoder.encode("Error fetching users: " + error.message));
        controller.close();
        return;
      }

      const filteredUsers = users?.filter((user) => user.timezone && user.telegram_chat_id || user.phone) || [];

      for (const user of filteredUsers) {
        try {
          await queueInsightTask(user);
          controller.enqueue(encoder.encode(`Task queued successfully for user: ${JSON.stringify(user)}\n`));
        } catch (error) {
          controller.enqueue(encoder.encode(`Error queuing task for user: ${JSON.stringify(user)} with error: ${error}\n`));
        }
      }

      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

const queueInsightTask = async (user: any) => {
  const taskData = {
    userId: user.id,
    timezone: user.timezone,
    fullName: user.full_name,
    telegramChatId: user.telegram_chat_id,
    phone: user.phone,
    goal: user.goal,
  };

  const baseUrl = getURL().replace(/\/$/, '')
  const url = baseUrl + '/api/single-static-prompts';
  console.log("Queuing task for user:", user, "at url:", url);


  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  const responseData = await response.json();
  if (!response.ok) {
    console.log("Failed to queue task for user:", user, "with response:", responseData);
    throw new Error(responseData.message || "Failed to queue task");
  }

  console.log("Task queued successfully for user:", user, "with response:", responseData);
}