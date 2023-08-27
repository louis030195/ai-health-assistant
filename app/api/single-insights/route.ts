import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { baseMediarAI, generalMediarAIInstructions } from '@/lib/utils';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { llm } from '@/utils/llm';
import TelegramBot from 'node-telegram-bot-api';

// export const runtime = 'edge'

// curl -X POST -d '{"userId":"20284713-5cd6-4199-8313-0d883f0711a1","timezone":"America/Los_Angeles","fullName":"Louis","telegramChatId":"5776185278"}' -H "Content-Type: application/json" http://localhost:3000/api/single-insights


export async function POST(req: Request) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  const { userId, timezone, fullName, telegramChatId } = await req.json()

  if (!userId || !timezone || !telegramChatId) {
    console.log("Missing userId, timezone, fullName, or telegramChatId:", userId, timezone, fullName, telegramChatId);
    return NextResponse.json({ message: "Missing userId, timezone, fullName, or telegramChatId" }, { status: 400 });
  }

  console.log("Got user:", userId, timezone, fullName, telegramChatId);

  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

  const user = {
    id: userId,
    timezone,
    full_name: fullName,
    telegram_chat_id: telegramChatId
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
    return;
  }

  const { data } = await supabase
    .from('states')
    .select()
    .eq('metadata->>label', 'focus')
    .eq('user_id', user.id)
    .gte('created_at', threeDaysAgoFromOneAm)
    .order('created_at', { ascending: false })
    .limit(10000)
  console.log("Retrieved Neurosity data:", data?.length);

  // Group by 300 samples and average the probability
  const neuros = data
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

  console.log(threeDaysAgoFromOneAm.split(' ')[0])
  const { data: ouras } = await supabase
    .from('states')
    .select()
    // format as YYYY-MM-DD instead of dd/mm/yyyy
    .gte('oura->>day', new Date(threeDaysAgoFromOneAm).toISOString().split('T')[0])
    .eq('user_id', user.id)
    .order('oura->>day', { ascending: false })
    .limit(100)
  console.log("Retrieved Oura data:", ouras?.length);

  const tags = await getTags(user.id, threeDaysAgoFromOneAm);
  console.log("Retrieved tags:", tags);

  // if the user has nor tags, neuros, ouras, skip to next user

  if (!tags && (!neuros || neuros.length === 0) && (!ouras || ouras.length === 0)) {
    console.log("No tags, neuros, or ouras for user:", user);
    return;
  }
  console.log("User has neuros of length:", neuros?.length, "and ouras of length:", ouras?.length);
  console.log("User has tags of length:", tags?.length);
  let insights = ''

  console.log("Generating insights for user:", user);
  
  let tagsString = '';
  tags.forEach((tag) => {
    tag.created_at = new Date(tag.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    tagsString += JSON.stringify(tag);
  });

  let neurosString = '';
  neuros.forEach((neuro: any) => {
    neuro.created_at = new Date(neuro.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    neurosString += JSON.stringify(neuro);
  });

  let ourasString = '';
  ouras?.forEach((oura) => {
    oura.created_at = new Date(oura.created_at!).toLocaleString('en-US', { timeZone: user.timezone });
    ourasString += JSON.stringify(oura);
  });


  if (neuros && neuros.length > 0 && ouras && ouras.length > 0) {
    insights = await llm(buildBothDataPrompt(neurosString, ourasString, tagsString, user.full_name));
  } else if (neuros && neuros.length > 0) {
    insights = await llm(buildOnlyNeurosityPrompt(neurosString, tagsString, user.full_name));
  } else if (ouras && ouras.length > 0) {
    insights = await llm(buildOnlyOuraRingPrompt(ourasString, tagsString, user.full_name));
  } else {
    insights = await llm(buildOnlyTagsPrompt(tagsString, user.full_name));
  }

  console.log("Generated insights:", insights);

  if (!insights) {
    console.error("No insights generated for user:", user);
    return;
  }


  const { data: d2, error: e2 } = await supabase.from('chats').insert({
    text: insights,
    user_id: user.id,
  });
  console.log("Inserted chat:", d2, "with error:", e2);

  // const response = await sendWhatsAppMessage(user.phone!, insights);
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
}

// curl -X POST http://localhost:3000/api/insights

function buildBothDataPrompt(neuros: string, ouras: string, tags: string, fullName: string | null) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: ${baseMediarAI}
Generate a list of insights${userReference} about how the user's activities (tags) influence their health and cognitive performance, 
given these tags: ${JSON.stringify(tags)} 
And these Neurosity states: ${JSON.stringify(neuros)} 
and these OuraRing states: ${JSON.stringify(ouras)} 
${generalMediarAIInstructions}
Assistant:`;
}

function buildOnlyNeurosityPrompt(neuros: string, tags: string, fullName: string | null) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: ${baseMediarAI}
Generate a list of insights${userReference} about how the user's activities (tags) influence their cognitive performance, 
given these tags: ${JSON.stringify(tags)} 
And these Neurosity states: ${JSON.stringify(neuros)} 
${generalMediarAIInstructions}
Assistant:`;
}

function buildOnlyOuraRingPrompt(ouras: string, tags: string, fullName: string | null) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: ${baseMediarAI}
Generate a list of insights${userReference} about how the user's activities (tags) influence their health, 
given these tags: ${JSON.stringify(tags)} 
And these OuraRing states: ${JSON.stringify(ouras)} 
${generalMediarAIInstructions}
Assistant:`;
}

function buildOnlyTagsPrompt(tags: string, fullName: string | null) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: ${baseMediarAI}
Generate a list of insights${userReference} about how the user's activities (tags) influence their health and cognitive performance, 
given these tags: ${JSON.stringify(tags)} 
${generalMediarAIInstructions}
Assistant:`;
}


const getTags = async (userId: string, date: string) => {
  console.log("Getting tags for user:", userId, "since date:", date);
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  const { data, error } = await supabase
    .from('tags')
    .select('text, created_at')
    .eq('user_id', userId)
    .gt('created_at', date)

  if (error) {
    console.log("Error fetching tags:", error.message);
  }
  return data || [];
};
