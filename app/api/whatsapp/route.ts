import { addTags } from "@/app/supabase-server";
import { sendWhatsAppMessage } from "@/app/whatsapp-server";
import { Database } from "@/types_db";
import { createClient } from "@supabase/supabase-js";
export const runtime = 'edge'

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
const quotes = [
  "✨ Small daily improvements add up to big results over time. Keep logging your health data with Mediar!",

  "💫 The journey of a thousand miles begins with a single step. Start optimizing your wellbeing today!",

  "🌼 Your health data is beautiful and unique. Mediar will help you understand your patterns better.",

  "💯 Progress requires patience. Stick with tracking your health, you've got this!",

  "🤝 Mediar is here to help you unlock your best self. We're in this together!",

  "🌻 Wellbeing takes work, but it's worth it. Keep striving for health!",

  "🙌 The body and mind achieve what they believe. Believe in yourself and your health goals!"
]

// Define the type for the incoming request
interface IncomingRequest {
  SmsMessageSid: string;
  NumMedia: number;
  ProfileName: string;
  SmsSid: string;
  WaId: string;
  SmsStatus: string;
  Body: string;
  To: string;
  NumSegments: number;
  ReferralNumMedia: number;
  MessageSid: string;
  AccountSid: string;
  From: string;
  ApiVersion: string;
}

const llm = async (message: string, maxTokens = 5) => {
  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!
    },
    body: JSON.stringify({
      prompt: message,
      model: 'claude-instant-1.2', // 'claude-2',
      max_tokens_to_sample: maxTokens,
      stream: false
    })
  })
  if (!response.ok) {
    throw new Error(`Anthropic API returned ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return data.completion
}

const base = `Human: You are an AI assistant that receive message through Whatsapp by users.
The product that is integrated with WhatsApp is called Mediar, insights about your brain.
Basically people wear a device that record their brain, heart, sleep, and physical activity and send tags to you regarding the things they do,
or experience during the day or their life, on the go, for example: "just ate an apple", or "just had a fight with my wife", or "im sad", or "so low energy tday..".
The goal is to have a better understanding of the users' body and mind, and show them patterns and insights about it in order to help them improve their wellbeing.

(atm you can only deal with sentences, not images or videos)`
const isATag = async (message: string) => {

  // try to guess if it seems to be a add tag request using a llm, if yes, add the tag 
  const prompt = `${base}

Your only job is to determine if the message sent by the user is a tag or another request.

Tag examples:
- coffee
- workout 1 hour ago
- no sun today
- poor sleep

Tag counter examples:
- https://www.youtube.com/watch?v=1qN72LEQnaU
- https://imgur.com/gallery/1qN72LEQnaU
- image.jpg

YOU ONLY ANSWER 1 (it's a tag) or 0 (it's not a tag).

This is the message sent by the user: "${message}".

Assistant:`

  const response = await llm(prompt)
  const isATag = response.trim().includes('1')

  return isATag
}

const isQuestion = async (message: string) => {

  const prompt = `${base}

YOU ONLY ANSWER 1 (it's a question) or 0 (it's not a question).

Question examples:
- What is my average heart rate last week?
- What is my sleep score?
- What is my average HRV?
- What is my focus score last few days?
- How i can improve my sleep?

Counter examples:
- https://www.youtube.com/watch?v=1qN72LEQnaU
- Who the fuck are you?

This is the message sent by the user: "${message}".

Assistant:`

  const response = await llm(prompt)
  return response.trim().includes('1')
}

const track = async (userId: string) => {
  await fetch(
    'https://app.posthog.com/capture/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: 'phc_V7co1flWmfnd9Hd6LSyPRau9sARsxMEiOrmNvGeUhbJ',
        event: 'whatsapp message received',
        distinct_id: userId,
      }),
    }
  )
}

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  // @ts-ignore
  const parsed = Object.fromEntries(params) as IncomingRequest;

  console.log(parsed);
  const phoneNumber = parsed.From.replace('whatsapp:', '')
  // get userId
  const { data, error } = await supabase.from('users').select().eq('phone', phoneNumber).maybeSingle();
  if (error || !data) {
    console.log(error, data)
    return new Response(`Error fetching user or user not found. Error: ${error?.message}`, { status: 400 });

  }
  const userId = data.id
  const phoneVerified = data?.phone_verified || false
  await track(userId)
  if (!phoneVerified) {
    return new Response(`Your phone has not been verified!`);
  }

  try {
    console.log(`Message from ${parsed.ProfileName}: ${parsed.Body}`);

    const [isATagResponse, isQuestionResponse] = await Promise.all([
      isATag(parsed.Body),
      isQuestion(parsed.Body)
    ]);
    if (isQuestionResponse) {
      await sendWhatsAppMessage(phoneNumber, "Sure, give me a few seconds to read your data and I'll get back to you with an answer in less than a minute 🙏.")
      const prompt = await generatePromptForUser(userId)
      console.log("Prompt:", prompt);
      const response = await llm(prompt, 500)
      console.log("Response:", response);
      return new Response(response);
    } else if (isATagResponse) {
      await addTags(userId, parsed.Body)
      return new Response(`Got it! I've recorded your tag. Keep sending me more tags it will help me understand you better.
By connecting your wearables like Oura or Neurosity, I can give you better insights about your mind and body.

${quotes[Math.floor(Math.random() * quotes.length)]}`
      );
    }

    return new Response(`My sole purpose at the moment is to associate tags related to what is happening in your life to your brain activity.
You can send me messages like "just ate an apple", or "just had a fight with my wife", or "im sad", or "so low energy tday..".
This way I will better understand your brain and how it works, and give you better insights about it.

${quotes[Math.floor(Math.random() * quotes.length)]}`);
  } catch (error) {
    console.log(error);
    return new Response(
      'Webhook handler failed. View your nextjs function logs.',
      { status: 500 });
  }
}

async function generatePromptForUser(userId: string): Promise<string> {
  // 1. Fetch the user's information
  const { error, data: users } = await supabase
    .from('users')
    .select('id, phone, timezone, full_name')
    .eq('id', userId);

  if (error || !users || users.length === 0) {
    throw new Error(`Error fetching user or user not found. Error: ${error?.message}`);
  }

  const user = users[0];

  // 2. Compute yesterday's date for the user
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString('en-US', { timeZone: user.timezone });

  // 3. Retrieve Neurosity data for the user
  const { data } = await supabase
    .from('states')
    .select('created_at, probability')
    .eq('metadata->>label', 'focus')
    .gte('created_at', yesterday)
    .order('created_at', { ascending: false });

  // Group by 300 samples and average the probability
  const neuros = data?.reduce((acc: any, curr, index, array) => {
    if (index % 300 === 0) {
      const slice = array.slice(index, index + 300);
      const avgProbability = slice.reduce((sum, item) => sum + (item.probability || 0), 0) / slice.length;
      acc.push({ created_at: curr.created_at, probability: avgProbability });
    }
    return acc;
  }, []);


  // 4. Retrieve Oura data for the user
  const { data: ouras } = await supabase
    .from('states')
    .select()
    .gte('oura->>day', yesterday.split(' ')[0])
    .order('oura->>day', { ascending: false });

  // 5. Retrieve tags for the user
  const tags = await getTags(userId, yesterday);

  // 6. Construct the prompt based on available data
  let prompt = '';
  if (neuros && neuros.length > 0 && ouras && ouras.length > 0) {
    console.log("Both neuros and ouras data available");
    prompt = buildBothDataPrompt(neuros, ouras, tags, user.full_name);
  } else if (neuros && neuros.length > 0) {
    console.log("Only neuros data available");
    prompt = buildOnlyNeurosityPrompt(neuros, tags, user.full_name);
  } else if (ouras && ouras.length > 0) {
    console.log("Only ouras data available");
    prompt = buildOnlyOuraRingPrompt(ouras, tags, user.full_name);
  }

  return prompt;
}

const generalInstructions = `Here are a few rules: 
- Your answers are very concise and straight to the point 
- Your answers are based on the data provided 
- Your answers are only the bullet points, and potentially some advices for the user at the end if you find any 
- Do not say bullshit health advice, just infer from the data 
- Your response will directly be sent to the user so change your language accordingly
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
const getTags = async (userId: string, date: string) => {
  console.log("Getting tags for user:", userId, "since date:", date);

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