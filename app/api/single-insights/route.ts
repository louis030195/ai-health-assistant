import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { baseMediarAI, buildInsightCleanerPrompt, buildInsightPrompt, generalMediarAIInstructions, generateGoalPrompt } from '@/lib/utils';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { llm, llmPrivate } from '@/utils/llm';
import TelegramBot from 'node-telegram-bot-api';
import PostHogClient from '@/app/posthog-server';
import { generateDataStringsAndFetchData } from '@/lib/get-data';

// export const runtime = 'edge'
export const maxDuration = 300

// curl -X POST -d '{"userId":"20284713-5cd6-4199-8313-0d883f0711a1","timezone":"America/Los_Angeles","fullName":"Louis","telegramChatId":"5776185278", "phone": "+33648140738", "goal": "Reduce my anxiety and find a partner to have a symbiotic relationship."}' -H "Content-Type: application/json" http://localhost:3000/api/single-insights


// curl -X POST -d '{"userId":"20284713-5cd6-4199-8313-0d883f0711a1","timezone":"America/Los_Angeles","fullName":"Louis","telegramChatId":"5776185278", "phone": "+33648140738", "goal": "I want to improve my mood by practicing mindfulness and meditation."}' -H "Content-Type: application/json" http://localhost:3000/api/single-insights


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

    const usersToday = new Date().toLocaleString('en-US', { timeZone: user.timezone })
    const threeDaysAgo = new Date(new Date().setDate(new Date().getDate() - 3)).toLocaleString('en-US', { timeZone: user.timezone });

    // const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString('en-US', { timeZone: user.timezone })
    console.log("Yesterday's date for user:", threeDaysAgo);
    // const yesterdayFromOneAm = new Date(new Date(yesterday).setHours(1, 0, 0, 0)).toLocaleString('en-US', { timeZone: user.timezone })
    const threeDaysAgoFromOneAm = new Date(new Date(threeDaysAgo).setHours(1, 0, 0, 0)).toLocaleString('en-US', { timeZone: user.timezone });

    // check if there is already an insight at the today timezone of the user
    const { data: todaysInsights } = await supabase
      .from("insights")
      .select()
      .eq("user_id", user.id)
      .gte('created_at', usersToday)

    // If an insight has already been sent today, skip to the next user
    if (todaysInsights && todaysInsights.length > 0) {
      console.log("Insight already sent today for user:", user);
      return NextResponse.json({ message: "Insight already sent today" }, { status: 200 });
    }

    const { success, neurosString, tagsString, ourasString, appleHealthString } = await generateDataStringsAndFetchData(user, threeDaysAgoFromOneAm);

    if (!success) return NextResponse.json({ message: "No tags and health data" }, { status: 200 });

    // const prompt = await llm(buildInsightCleanerPrompt(
    //   `Data since ${threeDaysAgoFromOneAm}:\n${neurosString}\n${tagsString}\n${ourasString}\n${appleHealthString}`, user));

    // console.log("Prompt:", prompt);
    const insights = await llm(buildInsightPrompt(`Data since ${threeDaysAgoFromOneAm}:\n${neurosString}\n${tagsString}\n${ourasString}\n${appleHealthString}`, user));

    console.log("Generated insights:", insights);

    if (!insights) {
      console.error("No insights generated for user:", user);
      return NextResponse.json({ message: "No insights generated" }, { status: 200 });
    }


    const { data: d2, error: e2 } = await supabase.from('chats').insert({
      text: insights,
      user_id: user.id,
    });
    console.log("Inserted chat:", d2, "with error:", e2);

    if (phone) {
      console.log("Sending whatsapp message to user:", user);
      // 1. check when was the last whatsapp message with this user

      const { data: lastWhatsappMessage, error: e4 } = await supabase
        .from('chats')
        .select()
        .eq('user_id', user.id)
        .eq('channel', 'whatsapp')
        .gte('created_at', usersToday)
        .order('created_at', { ascending: false })
        .limit(1)

      if (e4) {
        console.log("Error fetching last whatsapp message:", e4.message);
      } else {
        console.log("Last whatsapp message:", lastWhatsappMessage);

        // 2. if it was less than 24 hours ago, skip

        // 3. if it was more than 24 hours ago, send the template message
        const lastMessage = lastWhatsappMessage[0];
        const lastMessageDate = lastMessage?.created_at ? new Date(lastMessage.created_at!).getTime() : 0;
        const now = new Date().getTime();
        const diff = now - lastMessageDate;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        console.log("Last whatsapp message was:", hours, "hours ago");
        if (!lastWhatsappMessage || lastWhatsappMessage.length === 0 || hours > 24) {

          // const template = `👋  Hey! Your health matter a lot to me 🥦💪🧠. How can I become a better health assistant for you?`
          const template = `👋 Hey! Your health matter a lot to me 🥦💪🧠. How can I become a better health assistant for you?`
          await sendWhatsAppMessage(phone, template);
        }

        // 4. send the insight
        await sendWhatsAppMessage(phone, insights);
      }

    }
    const response = await bot.sendMessage(
      user.telegram_chat_id!,
      insights,
      { parse_mode: 'Markdown' }
    )
    console.log("Message sent to:", user.telegram_chat_id, "with response:", response);

    const { error: e3 } = await supabase.from('insights').insert({
      text: insights,
      user_id: user.id,
    });

    console.log("Inserted insight:", insights, "with error:", e3);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error:", error, userId, timezone, fullName, telegramChatId);
    return NextResponse.json({ message: "Error" }, { status: 200 });
  }
}


