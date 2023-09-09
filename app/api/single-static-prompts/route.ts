import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

// export const runtime = 'edge'
export const maxDuration = 300

// curl -X POST -d '{"userId":"20284713-5cd6-4199-8313-0d883f0711a1","timezone":"America/Los_Angeles","fullName":"Louis","telegramChatId":"5776185278", "phone": "+...", "goal": "I aim to increase my productivity by improving my time management skills and maintaining a healthy work-life balance."}' -H "Content-Type: application/json" http://localhost:3000/api/single-prompts


export async function POST(req: Request) {
  const { userId, timezone, fullName, telegramChatId, phone, goal } = await req.json()
  try {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    )

    if (!userId || !timezone || !telegramChatId) {
      console.log("Missing userId, timezone, fullName, or telegramChatId:", userId, timezone, fullName, telegramChatId);
      return NextResponse.json({ message: "Missing userId, timezone, fullName, or telegramChatId" }, { status: 200 });
    }

    console.log("Got user:", userId, timezone, fullName, telegramChatId);

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

    const user = {
      id: userId,
      timezone,
      full_name: fullName,
      telegram_chat_id: telegramChatId,
      goal: goal || '',
    }
    console.log("Processing user:", user);

    let prompt = "How do you feel today on a scale of 1 to 5? 😃"

    console.log("Generated prompt:", prompt);

    if (!prompt) {
      console.error("No prompt generated for user:", user);
      return NextResponse.json({ message: "No prompt generated" }, { status: 200 });
    }

    // return NextResponse.json({ message: "Success" }, { status: 200 });

    const { data: d2, error: e2 } = await supabase.from('chats').insert({
      text: prompt,
      user_id: user.id,
    });
    console.log("Inserted chat:", d2, "with error:", e2);

    // const hasWhatsapp = await getFeatureFlag(user.id);
    if (phone) {
      console.log("Sending whatsapp message to user:", user);
      // 1. check when was the last whatsapp message with this user

      // 4. send the question
      await sendWhatsAppMessage(phone, prompt);

    }
    const response = await bot.sendMessage(
      user.telegram_chat_id!,
      prompt,
      { parse_mode: 'Markdown' }
    )
    console.log("Message sent to:", user.telegram_chat_id, "with response:", response);

    const { error: e3 } = await supabase.from('prompts').insert({
      text: prompt,
      user_id: user.id,
      type: 'static',
    });

    console.log("Inserted question:", prompt, "with error:", e3);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error:", error, userId, timezone, fullName, telegramChatId);
    return NextResponse.json({ message: "Error" }, { status: 200 });
  }
}

