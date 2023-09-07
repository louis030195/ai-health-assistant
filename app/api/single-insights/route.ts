import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { baseMediarAI, buildBothDataPrompt, buildInsightCleanerPrompt, buildInsightPrompt, buildOnlyNeurosityPrompt, buildOnlyOuraRingPrompt, buildOnlyTagsPrompt, generalMediarAIInstructions, generateGoalPrompt } from '@/lib/utils';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { llm, llmPrivate } from '@/utils/llm';
import TelegramBot from 'node-telegram-bot-api';
import PostHogClient from '@/app/posthog-server';

// export const runtime = 'edge'
export const maxDuration = 300

// curl -X POST -d '{"userId":"20284713-5cd6-4199-8313-0d883f0711a1","timezone":"America/Los_Angeles","fullName":"Louis","telegramChatId":"5776185278", "phone": "+33648140738", "goal": "I aim to increase my productivity by improving my time management skills and maintaining a healthy work-life balance."}' -H "Content-Type: application/json" http://localhost:3000/api/single-insights


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


async function generateDataStringsAndFetchData(user: any, threeDaysAgoFromOneAm: string) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const [neurosData, ourasData, appleHealthsData, tagsData] = await Promise.all([
    supabase
      .from('states')
      .select('probability, created_at')
      .eq('metadata->>label', 'focus')
      .eq('user_id', user.id)
      .gte('created_at', threeDaysAgoFromOneAm)
      .order('created_at', { ascending: false })
      .limit(10000),
    supabase
      .from('states')
      .select('oura, created_at')
      .eq('user_id', user.id)
      .gte('oura->>day', new Date(threeDaysAgoFromOneAm).toISOString().split('T')[0]),
      // .limit(100),
    supabase
      .from('states')
      .select("created_at, apple_health_data")
      .not('apple_health_data', 'is', null)
      .gte('created_at', threeDaysAgoFromOneAm)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
      // .limit(100),
    supabase
      .from('tags')
      .select('text, created_at')
      .eq('user_id', user.id)
      .gt('created_at', threeDaysAgoFromOneAm)
  ]);

  const { data: neuros } = neurosData;
  const { data: ouras } = ourasData;
  let { data: appleHealths } = appleHealthsData;
  const { data: tags } = tagsData;


  console.log("Retrieved Neurosity data:", neuros?.length);

  // Group by 300 samples and average the probability
  const groupedNeuros = neuros
    // filter out < 0.3 probability
    ?.filter((item) => item.probability && item.probability! > 0.3)
    ?.reduce((acc: any, curr, index, array) => {
      if (index % 300 === 0) {
        const slice = array.slice(index, index + 300);
        const avgProbability = slice.reduce((sum, item) => sum + (item.probability || 0), 0) / slice.length;
        acc.push({ created_at: curr.created_at, probability: avgProbability });
      }
      return acc;
    }, []);

  console.log(new Date(threeDaysAgoFromOneAm).toISOString().split('T')[0])

  console.log("Retrieved Oura data:", ouras?.length);



  console.log("Retrieved Apple Health data:", appleHealths?.length);

  // group apple health data by date
  const appleHealthActivities = appleHealths?.reduce((acc: any, curr: any) => {
    if (curr.apple_health_data.activitiesData) {
      curr.apple_health_data.activitiesData.forEach((activity: any) => {
        const dayOfTheWalking = new Date(activity.activityTime).toLocaleString('en-US', { timeZone: user.timezone }).split(' ')[0];
        if (!acc[dayOfTheWalking]) acc[dayOfTheWalking] = { activityCalories: 0, activityDuration: 0 };
        acc[dayOfTheWalking].activityCalories += activity.activityCalories;
        // }
      });
    }
    return acc;
  }, {});

  console.log("appleHealthActivities", appleHealthActivities);

  // remove activites
  // @ts-ignore
  appleHealths?.forEach((appleHealth: any) => {
    if (appleHealth.apple_health_data.activitiesData) {
      delete appleHealth.apple_health_data.activitiesData;
    }
  });
  console.log("Filtered Apple Health data:", appleHealths);

  // if the user has nor tags, neuros, ouras, skip to next user

  if (!tags && (!neuros || neuros.length === 0) && (!ouras || ouras.length === 0) && (!appleHealths || appleHealths.length === 0)) {
    console.log("No tags, neuros, or ouras for user:", user);
    return { success: false, tagsString: '', neurosString: '', ourasString: '', appleHealthString: '' };
  }
  console.log("User has neuros of length:", neuros?.length, "and ouras of length:", ouras?.length, "and appleHealths of length:", appleHealths?.length);
  console.log("User has tags of length:", tags?.length);

  console.log("Generating insights for user:", user);

  let tagsString = '';
  tags?.forEach((tag) => {
    tag.created_at = new Date(tag.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    tagsString += JSON.stringify(tag);
  });

  let neurosString = '';
  groupedNeuros?.forEach((neuro: any) => {
    neuro.created_at = new Date(neuro.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    neurosString += JSON.stringify(neuro);
  });

  let ourasString = '';
  ouras?.forEach((oura) => {
    oura.created_at = new Date(oura.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    ourasString += JSON.stringify(oura);
  });

  let appleHealthString = '';
  appleHealths?.forEach((appleHealth) => {
    appleHealth.created_at = new Date(appleHealth.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    appleHealthString += JSON.stringify(appleHealth);
  });
  Object.keys(appleHealthActivities).forEach((key) => {
    appleHealthString += JSON.stringify(appleHealthActivities[key]);
  });

  return { success: true, tagsString, neurosString, ourasString, appleHealthString };
}

