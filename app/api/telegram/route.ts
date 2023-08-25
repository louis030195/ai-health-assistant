import { Database } from "@/types_db";
import { createClient } from "@supabase/supabase-js";
import { kv } from '@vercel/kv';
import fetch from 'node-fetch';
import { baseMediarAI, generalMediarAIInstructions } from "@/lib/utils";
import { sendTelegramMessage } from "@/app/telegram-server";
// export const runtime = 'edge'


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
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    },
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    },
    date: number;
    text: string;
    photo?: { // Add this line
      file_id: string;
      file_unique_id: string;
      width: number;
      height: number;
      file_size?: number;
    }[];
  }
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
  const data = await response.json()

  if (data.error) {
    throw new Error(`Anthropic API returned ${response.status} with error: ${JSON.stringify(data.error)}`)
  }
  return data.completion
}


const isTagOrQuestion = async (message: string) => {

  const prompt = `Human: ${baseMediarAI}

YOU ONLY ANSWER:
- 2 if it's a tag 
- 1 if it's a question
- 0 otherwise

Tag examples: 
- coffee
- workout 1 hour ago
- no sun today
- poor sleep

Question examples:
- What is my average heart rate last week?
- How can I improve my sleep?

This is the message sent by the user: "${message}"

Assistant:`

  const response = await llm(prompt, 10)

  if (response.trim().includes('2')) {
    return 'tag'
  } else if (response.trim().includes('1')) {
    return 'question'
  } else {
    return 'none'
  }
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
        event: 'telegram message received',
        distinct_id: userId,
      }),
    }
  )
}
const QUESTION_PREFIX = 'question_';
const TAG_PREFIX = 'tag_';

const welcomeMessage = `🤖 Hi! It's Mediar, your health assistant! 👋 

To help me understand best how events in your life affect your health, simply send me tags about your daily activities, moods, foods, workouts, etc. 

For example:

- ☕ Had coffee
- 😊 Feeling happy 
- 🍎 Ate an apple
- 🏋️‍♀️ Did 30 mins workout

FYI, I can deal with grammar mistakes and typos! 🤓

You can also send me pictures of your meals, workouts, drinks, etc. 📸. I'll try to understand what's in the picture and tag it for you! 🤖

I'll use these tags to provide personalized daily insights on how to improve your focus, sleep, stress and general health! 🧘‍♀️🥰

If you want to know more about your health, just ask me questions like:
- How can I improve my sleep?
- How can I reduce my stress?
- What's my focus score?

If you have any feedback or questions ❓ about Mediar, just join the Discord community or email 💌 louis@mediar.ai.

Your health matter ❤️🥦💪🧠`

export async function POST(req: Request) {
  const body = await req.json();
  const token = process.env.TELEGRAM_BOT_TOKEN!;

  const bot = new TelegramBot(token);
  bot.sendChatAction(body.message.chat.id, "typing");
  console.log("Incoming request:", body);
  if (body.message.photo) {
    console.log("Image received");
    // Handle the image here
  } else {
    console.log("No image in the message");
  }
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  // 1. find username in users table
  const { data, error } = await supabase
    .from('users')
    .select('id, phone, timezone, full_name, telegram_chat_id')
    .eq('telegram_username', body.message.from.username)
    .limit(1);

  if (error || !data || data.length === 0) {
    console.log(error, data)
    return new Response(`Error fetching user or user not found. Error: ${error?.message}`, { status: 400 });
  }
  const userId = data[0].id
  await track(userId)
  const { data: d2, error: e2 } = await supabase.from('chats').insert({
    text: body.message.text,
    user_id: userId,
  });
  console.log("Chat added:", d2, e2);
  const date = new Date().toLocaleDateString('en-US');
  const questionKey = QUESTION_PREFIX + userId + '_' + date;
  const tagKey = TAG_PREFIX + userId + '_' + date;

  console.log("Question key:", questionKey, "Tag key:", tagKey);
  const questionCount = await kv.get(questionKey);
  const tagCount = await kv.get(tagKey);
  console.log("Question count:", questionCount, "Tag count:", tagCount);

  // 2. set telegram_chat_id in users table
  if (!data[0].telegram_chat_id) {
    const { error: e3 } = await supabase.from('users').update({
      telegram_chat_id: body.message.chat.id.toString()
    }).match({ id: userId });
    if (e3) {
      console.log("Error updating user:", e3.message);
      return new Response(`Error updating user. Error: ${e3.message}`, { status: 400 });
    }
    await sendTelegramMessage(body.message.chat.id.toString(), welcomeMessage)
    return new Response(welcomeMessage, { status: 200 });
  }

  const hasImage = body.message.photo && body.message.photo.length > 0;
  if (hasImage) {
    // await sendWhatsAppMessage(phoneNumber, "Sure, give me a few seconds to understand your image 🙏. PS: I'm not very good at understanding images yet, any feedback appreciated ❤️")
    await sendTelegramMessage(body.message.chat.id.toString(), "Sure, give me a few seconds to understand your image 🙏. PS: I'm not very good at understanding images yet, any feedback appreciated ❤️")
    await kv.incr(tagKey);
    console.log("Image received, sending to inference API");

    const urlContentToDataUri = async (url: string) => {
      const response = await fetch(url);
      const buffer = await response.buffer();
      const base64 = buffer.toString('base64');
      return base64;
    };
    // const caption = response.generated_text;
    const b64Image = await urlContentToDataUri(body.message.photo![0].file_id);
    // @ts-ignore
    const [elementsCaption, actionCaption, textCaption]: string[] = await Promise.all([
      getCaption('list each element in the image', b64Image),
      getCaption('what is the person doing?', b64Image),
      getCaption('what is the written text?', b64Image)
    ]);
    let captions = []

    // if detected caption is not "unanswerable", add it to the caption
    // `elements: ${elementsCaption}, action: ${actionCaption}, text: ${textCaption}`;
    if (elementsCaption !== 'unanswerable') {
      captions.push('elements: ' + elementsCaption)
    }
    if (actionCaption !== 'unanswerable') {
      captions.push('action: ' + actionCaption)
    }
    if (textCaption !== 'unanswerable') {
      captions.push('text: ' + textCaption)
    }
    const caption = captions.join('\n')
    // list each element in the image
    // what is the person doing?
    console.log("Caption:", caption);

    // Insert as tag
    const { data: d2, error: e2 } = await supabase.from('tags').insert({
      text: caption,
      user_id: userId
    });

    console.log("Tag added:", d2, e2);

    // Return response
    return new Response(`I see in your image "${caption}". I've recorded that tag for you and associated this to your health data.
Feel free to send me more images and I'll try to understand them! Any feedback appreciated ❤️!
${quotes[Math.floor(Math.random() * quotes.length)]}`);
  }
  try {
    console.log(`Message from ${body.message.from.username}: ${body.message.text}`);

    const intent = await isTagOrQuestion(body.message.text);
    if (intent === 'question') {
      await kv.incr(questionKey);
      // await sendWhatsAppMessage(phoneNumber, "Sure, give me a few seconds to read your data and I'll get back to you with an answer in less than a minute 🙏. PS: I'm not very good at answering questions yet, any feedback appreciated ❤️")
      const prompt = await generatePromptForUser(userId, body.message.text);
      console.log("Prompt:", prompt);
      const response = await llm(prompt, 500)
      console.log("Response:", response);
      const { data, error } = await supabase.from('chats').insert({
        text: response,
        user_id: userId,
      });
      console.log("Chat added:", data, error);
      // await sendWhatsAppMessage(phoneNumber, response)
      return new Response("If you have any feedback, please send it to me! I'm still learning and any feedback is appreciated ❤️");
    } else if (intent === 'tag') {
      await kv.incr(tagKey);
      const { data, error } = await supabase.from('tags').insert({
        text: body.message.text,
        user_id: userId,
      });
      console.log("Tag added:", data, error);

      return new Response(`Got it! I've recorded your tag. Keep sending me more tags it will help me understand you better.
By connecting your wearables like Oura or Neurosity, I can give you better insights about your mind and body.

${quotes[Math.floor(Math.random() * quotes.length)]}`
      );
    }

    return new Response(`I'm sorry it seems you didn't ask a question neither tag an event from your life. My sole purpose at the moment is to associate tags related to what is happening in your life to your health data from your wearables.
You can send me messages like "just ate an apple", or "just had a fight with my wife", or "im sad", or "so low energy tday..".
This way I will better understand how your body works, and give you better insights about it. I can also answer questions like "how can i be more productive?" or "how can i improve my sleep?".

${quotes[Math.floor(Math.random() * quotes.length)]}`);
  } catch (error) {
    console.log(error);
    return new Response(
      'Webhook handler failed. View your nextjs function logs.',
      { status: 500 });
  }
}

async function generatePromptForUser(userId: string, question: string): Promise<string> {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

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


  // 4. Retrieve Oura data for the user
  const { data: ouras } = await supabase
    .from('states')
    .select()
    .gte('oura->>day', yesterday.split(' ')[0])
    .order('oura->>day', { ascending: false });

  // 5. Retrieve tags for the user
  const tags = await getTags(userId, yesterday);

  tags.forEach((tag) => tag.created_at = new Date(tag.created_at!).toLocaleString('en-US', { timeZone: user.timezone }))
  neuros.forEach((neuro: any) => neuro.created_at = new Date(neuro.created_at!).toLocaleString('en-US', { timeZone: user.timezone }))
  ouras?.forEach((oura) => oura.created_at = new Date(oura.created_at!).toLocaleString('en-US', { timeZone: user.timezone }))


  // 6. Construct the prompt based on available data
  let prompt = '';
  if (neuros && neuros.length > 0 && ouras && ouras.length > 0) {
    console.log("Both neuros and ouras data available");
    prompt = buildBothDataPrompt(neuros, ouras, tags, user.full_name, question);
  } else if (neuros && neuros.length > 0) {
    console.log("Only neuros data available");
    prompt = buildOnlyNeurosityPrompt(neuros, tags, user.full_name, question);
  } else if (ouras && ouras.length > 0) {
    console.log("Only ouras data available");
    prompt = buildOnlyOuraRingPrompt(ouras, tags, user.full_name, question);
  }

  return prompt;
}



function buildBothDataPrompt(neuros: object[], ouras: object[], tags: { text: string | null; created_at: string | null; }[], fullName: string | null, question: string) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: ${baseMediarAI}
Generate a list of insights${userReference} about how the user's activities (tags) influence their health and cognitive performance, 
given these tags: ${JSON.stringify(tags)} 
And these Neurosity states: ${JSON.stringify(neuros)} 
and these OuraRing states: ${JSON.stringify(ouras)} 
That answer the user's question: ${question}
${generalMediarAIInstructions}
Assistant:`;
}

function buildOnlyNeurosityPrompt(neuros: object[], tags: { text: string | null; created_at: string | null; }[], fullName: string | null, question: string) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: ${baseMediarAI}
Generate a list of insights${userReference} about how the user's activities (tags) influence their cognitive performance, 
given these tags: ${JSON.stringify(tags)} 
And these Neurosity states: ${JSON.stringify(neuros)} 
That answer the user's question: ${question}
${generalMediarAIInstructions}
Assistant:`;
}

function buildOnlyOuraRingPrompt(ouras: object[], tags: { text: string | null; created_at: string | null; }[], fullName: string | null, question: string) {
  const userReference = fullName ? ` for ${fullName}` : '';
  return `Human: ${baseMediarAI}
Generate a list of insights${userReference} about how the user's activities (tags) influence their health, 
given these tags: ${JSON.stringify(tags)} 
And these OuraRing states: ${JSON.stringify(ouras)} 
That answer the user's question: ${question}
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



import { auth } from "google-auth-library";
import { getURL } from "@/utils/helpers";
import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";
const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
const URL = `https://${API_ENDPOINT}/v1/projects/mediar-394022/locations/us-central1/publishers/google/models/imagetext:predict`;

const getIdToken = async () => {
  const client = auth.fromJSON(JSON.parse(process.env.GOOGLE_SVC!));
  // @ts-ignore
  client.scopes = ["https://www.googleapis.com/auth/cloud-platform"];
  // @ts-ignore
  const idToken = await client.authorize();
  return idToken.access_token;
};

const getCaption = async (prompt: string, base64Image: string) => {
  const headers = {
    Authorization: `Bearer ` + (await getIdToken()),
    "Content-Type": "application/json",
  };

  const data = {
    instances: [
      {
        prompt,
        image: {
          bytesBase64Encoded: base64Image,
        },
      },
    ],
    parameters: {
      sampleCount: 1
    }
  }

  const response = await fetch(URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error("Request failed " + response.statusText);
  }

  const result = await response.json();
  return result.predictions[0]
};



// Pure function to set webhook
async function setTelegramWebhook(url?: string) {
  // Telegram bot token 
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // Webhook endpoint URL
  const webhookUrl = url || 'https://mediar.ai/api/telegram';

  // API endpoint
  const apiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;

  // Webhook config object
  const webhookConfig = {
    url: webhookUrl
  };

  // API options 
  const options = {
    method: 'POST',
    body: JSON.stringify(webhookConfig),
    headers: { 'Content-Type': 'application/json' }
  };

  console.log('Setting Telegram webhook...');
  console.log('Webhook config:', webhookConfig);
  console.log('API URL:', apiUrl);
  // Call Telegram API  
  const response = await fetch(apiUrl, options)

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error("Request failed " + response.statusText);
  }

  const result = await response.json();
  console.log(result);
}

// Usage
// setTelegramWebhook('https://barely-honest-yak.ngrok-free.app/api/telegram');
// setTelegramWebhook('https://mediar.ai/api/telegram');

