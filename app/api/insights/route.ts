// ./app/api/insights/route.ts
import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'edge'


export async function GET(req: Request) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  const { error, data: users } = await supabase
    .from('users')
    .select('id, phone, timezone, full_name')
  console.log("Retrieved users:", users?.length);

  if (error) {
    console.log("Error fetching users:", error.message);
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }

  users
    ?.filter((user) => user.timezone && user.phone)
    ?.forEach(async (user) => {
      console.log("Processing user:", user);

      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString('en-US', { timeZone: user.timezone })
      console.log("Yesterday's date for user:", yesterday);
      const yesterdayFromOneAm = new Date(new Date(yesterday).setHours(1, 0, 0, 0)).toLocaleString('en-US', { timeZone: user.timezone })

      const { data } = await supabase
        .from('states')
        .select()
        .eq('metadata->>label', 'focus')
        .gte('created_at', yesterdayFromOneAm)
        .order('created_at', { ascending: false })
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

      const { data: ouras } = await supabase
        .from('states')
        .select()
        // format as YYYY-MM-DD
        .gte('oura->>day', yesterdayFromOneAm.split(' ')[0])
        .order('oura->>day', { ascending: false })
      console.log("Retrieved Oura data:", ouras?.length);

      const tags = await getTags(user.id, yesterdayFromOneAm);
      console.log("Retrieved tags:", tags);

      // if the user has nor tags, neuros, ouras, skip to next user

      if (!tags && (!neuros || neuros.length === 0) && (!ouras || ouras.length === 0)) {
        console.log("No tags, neuros, or ouras for user:", user);
        return;
      }
      console.log("User has neuros of length:", neuros?.length, "and ouras of length:", ouras?.length);

      let insights = ''

      console.log("Generating insights for user:", user);
      tags.forEach((tag) => tag.created_at = new Date(tag.created_at!).toLocaleString('en-US', { timeZone: user.timezone }))
      neuros.forEach((neuro: any) => neuro.created_at = new Date(neuro.created_at!).toLocaleString('en-US', { timeZone: user.timezone }))
      ouras?.forEach((oura) => oura.created_at = new Date(oura.created_at!).toLocaleString('en-US', { timeZone: user.timezone }))

      if (neuros && neuros.length > 0 && ouras && ouras.length > 0) {
        insights = await llm(buildBothDataPrompt(neuros, ouras, tags, user.full_name));
      } else if (neuros && neuros.length > 0) {
        insights = await llm(buildOnlyNeurosityPrompt(neuros, tags, user.full_name));
      } else if (ouras && ouras.length > 0) {
        insights = await llm(buildOnlyOuraRingPrompt(ouras, tags, user.full_name));
      } else {
        console.warn("No neuros or ouras for user:", user);
        return;
      }

      console.log("Generated insights:", insights);

      if (!insights) {
        console.error("No insights generated for user:", user);
        return;
      }

      const { data: d2, error } = await supabase.from('chats').insert({
        text: insights,
        user_id: user.id,
      });
      console.log("Inserted chat:", d2, "with error:", error);

      const response = await sendWhatsAppMessage(user.phone!, insights);
      console.log("Message sent to:", user.phone, "with response status:", response.status);
    })

  return NextResponse.json({ message: "Success" }, { status: 200 });
}

// curl -X POST http://localhost:3000/api/insights


const generalInstructions = `Here are a few rules: 
- Your answers are very concise and straight to the point 
- Your answers are based on the data provided 
- Your answers are only the bullet points, and potentially some advices for the user at the end if you find any 
- Do not say bullshit health advice, just infer from the data 
- Your response will directly be sent to the user so change your language accordingly
- Do not talk about you missing information, just don't say if you don't have enough data
- Do not talk about tags if you don't see any clear correlation with the wearable data`

function buildBothDataPrompt(neuros: object[], ouras: object[], tags: { text: string | null; created_at: string | null; }[], fullName: string | null) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: Generate a list of insights${userReference} about how the user's activities (tags) influence their health and cognitive performance, 
given these tags: ${JSON.stringify(tags)} 
And these Neurosity states: ${JSON.stringify(neuros)} 
and these OuraRing states: ${JSON.stringify(ouras)} 
${generalInstructions}
Assistant:`;
}

function buildOnlyNeurosityPrompt(neuros: object[], tags: { text: string | null; created_at: string | null; }[], fullName: string | null) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: Generate a list of insights${userReference} about how the user's activities (tags) influence their cognitive performance, 
given these tags: ${JSON.stringify(tags)} 
And these Neurosity states: ${JSON.stringify(neuros)} 
${generalInstructions}
Assistant:`;
}

function buildOnlyOuraRingPrompt(ouras: object[], tags: { text: string | null; created_at: string | null; }[], fullName: string | null) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: Generate a list of insights${userReference} about how the user's activities (tags) influence their health, 
given these tags: ${JSON.stringify(tags)} 
And these OuraRing states: ${JSON.stringify(ouras)} 
${generalInstructions}
Assistant:`;
}


const llm = async (message: string) => {
  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!
    },
    body: JSON.stringify({
      prompt: message,
      model: 'claude-2',
      // model: 'claude-instant-1.2',
      max_tokens_to_sample: 500,
      stream: false
    })
  })
  if (!response.ok) {
    throw new Error(`Anthropic API returned ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return data.completion
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