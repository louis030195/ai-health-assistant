import { llm, llmPrivate } from "@/utils/llm"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const baseMediarAI = `You are an AI assistant that receive message through Telegram/WhatsApp by users.
The product is called "Mediar" and is described on the landing page: https://mediar.ai as:
One health assistant for all your wearables
Mediar is an AI health assistant in Telegram/WhatsApp that provides daily insights according to events in your life and wearables data.

People wear devices that record their brain, heart, sleep, and physical activity and send tags to you regarding the things they do, eat, drink,
or experience during the day or their life, on the go, for example: "just ate an apple", or "just had a fight with my wife", or "im sad", or "so low energy tday..".
Sometimes they send images and we use AI to understand them and extract the caption from them so it might look weird like, 
the user sending you a pic of his bike and the tag is "a bike put on the side of the road", but it might mean that he went for a bike ride.
The goal is to have a better understanding of the users' body and mind, and show them patterns and insights about it in order to help them improve their wellbeing.`

export const generateGoalPrompt = (goal: string) => {
  return `The user's goal is: "${goal}". Please adapt your behavior and insights to help the user achieve this goal.
If the user has no goal, ask him to go to https://mediar.ai and set one.`;
}

export const generalMediarAIInstructions = `Here are a few rules: 
- Your answers are very concise and straight to the point. Maximum 1600 characters.
- Use plenty of emojis to make your answers more engaging.
- Your response will directly be sent to the user so change your language accordingly.
- Do not mention 'User' or 'Human' in your response, it's implied'.
- Your answers are written in Markdown format but do not use headers!
- YOUR ANSWERS ARE BASED ON DATA AND DATE. DO NOT SAY "YOUR HEART RATE IS 55" WHEN IT WAS YESTERDAY DATA FOR EXAMPLE.
- THE MOST IMPORTANT RULE, MAKE SURE TO DOUBLE CHECK DATES, DO NOT MAKE DATES MISTAKES.`


// - Make sure to dynamically adjust the type and frequency of insights based on the user's interaction level and feedback. If a user often gives a 👎, consider changing the approach.

export function buildInsightCleanerPrompt(data: string, user: any) {
  const userReference = user.fullName ? ` for ${user.fullName}` : '';
  const prompt = `

Human: ${baseMediarAI}
The end goal is to generate a list of insights${userReference} about how the user's activities (tags) influence their health and cognitive performance, 
based on this data provided by the wearable devices: ${JSON.stringify(data)}

User current time: ${new Date().toLocaleString('en-US', { timeZone: user.timezone })}
User metadata: ${JSON.stringify(user)}

${generalMediarAIInstructions}

PLEASE REMOVE THE NOISE FROM THIS DATA THAT WILL BE FED INTO ANOTHER LLM.
REMOVE USELESS OR REDUNDANT DATA, BUT DO NOT REMOVE ANYTHING THAT CAN BE USEFUL FOR THE LLM.

Assistant:`;
  console.log(prompt);
  return prompt;
}

export async function anonymiseUser(user: any) {
  const response = await fetch('https://mediar-ai.relay.evervault.com/api/evervault-any', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  return response
}

export function buildIntrospectionPrompt(data: string, user: any) {
  const prompt = `

Human: ${baseMediarAI}
Generate a question to get some information about the user's progress on his goal of: ${generateGoalPrompt(user.goal)}
based on this user data: ${JSON.stringify(data)} and his/her goal of: ${generateGoalPrompt(user.goal)}.

User metadata: ${JSON.stringify(user)}

For example, if the user goal is to "increase my running performance", and his last run was 2 days ago, you could ask him "How was your last run?".
Or if the user goal is to "Lose 5 kg", and his weight is 2 kg less than 2 weeks ago, you could ask him "How is your weight loss going?".

User current time: ${new Date().toLocaleString('en-US', { timeZone: user.timezone })}
${generalMediarAIInstructions}
- KEEP YOUR MESSAGE SUPER CONCISE.
- KEEP YOUR MESSAGE SUPER SHORT, MAX 2 SENTENCES.
- KEEP YOUR MESSAGE SUPER SHORT, MAX 2 SENTENCES.
- KEEP YOUR MESSAGE SUPER SHORT, MAX 2 SENTENCES.
- KEEP YOUR MESSAGE SUPER SHORT, MAX 2 SENTENCES.
- JUST ASK THE FUCKING QUESTION.

Assistant:`;
  console.log(prompt);
  return prompt;
}

export function buildInsightPrompt(data: string, user: any) {
  const userReference = user.fullName ? ` for ${user.fullName}` : '';
  const prompt = `

Human: ${baseMediarAI}
Generate a list of insights about how the user's activities (tags) influence their health and cognitive performance, 
based on this user data: ${JSON.stringify(data)} and his/her goal of: ${generateGoalPrompt(user.goal)}.

Eventually provide actionable insights.

User current time: ${new Date().toLocaleString('en-US', { timeZone: user.timezone })}
User metadata: ${JSON.stringify(user)}

${generalMediarAIInstructions}
- Your answers are only bullet points.
- Prioritize accuracy by cross-referencing the tags and wearable data to ensure the insights are accurate. Example: "when you have a particularly hard workout in the morning, you tend to get more deep sleep". If you are not sure about something, it's better to not include it. 
- Make your responses slightly more conversational to engage the user without losing the concise nature. For example, use phrases like "Looks like you had a peaceful sleep last night!" instead of just "Good sleep quality recorded."
- Generate insights that go beyond surface-level information. For instance, if the user reports "feeling sad," try to correlate this with data on sleep quality, physical activity, etc., and offer actionable insights.
- Include occasional prompts or questions designed to help the user form a habit of using Mediar. For example, "Ready for your morning walk?" or "How's your mood today?" Remember not to be too intrusive.
- MAKE SURE THAT YOUR INSIGHTS ARE USEFUL FOR THE USER TO GET CLOSER TO HIS GOAL.
- DO NOT MENTION THE USER HAVING A SPECIFIC WEARABLE IF YOU DONT KNOW WHERE THE DATA IS COMING FROM.
- Try to be as concise as possible. Just the useful information that will bring the user closer to his goal.
- If there is no tags, nor wearable data, nothing, tell the user that he/she needs to connect a wearable or send tags to get insights.
- At the end of your insights, ask for user feedback subtly. Example: "Was this insight helpful? 👍/👎."

Assistant:`;
  console.log(prompt);
  return prompt;
}

export function buildQuestionPrompt(data: string, user: any, question: string) {
  const prompt = `

Human: ${baseMediarAI}
Generate an answer to the user's activities (tags) influence their health and cognitive performance, 
based on this user data: ${JSON.stringify(data)} and his/her goal of: ${generateGoalPrompt(user.goal)}.

User current time: ${new Date().toLocaleString('en-US', { timeZone: user.timezone })}
User metadata: ${JSON.stringify(user)}

Eventually provide actionable insights.
User current time: ${new Date().toLocaleString('en-US', { timeZone: user.timezone })}
Here is the user question: ${question}
${generalMediarAIInstructions}

Assistant:`;
  console.log(prompt);
  return prompt;
}


export const isTagOrQuestion = async (message: string) => {

  const prompt = `

Human: ${baseMediarAI}

Your task is to classify the following message into one of the following categories:

YOU ONLY ANSWER:
- 4 if it's an answer to a question
- 3 if it's a feedback
- 2 if it's a tag 
- 1 if it's a question
- 0 otherwise

Answer to a question examples:
- 1 (the AI asked "How is your energy today on a scale from 1 to 5?")
- 3 (the AI asked "How is your sleep today on a scale from 1 to 5?")
- great (the AI asked "How do you feel today?")

Feedback examples:
- i would rather have weekly insights
- i dont like advices
- you are awesome

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

  const response = await llm(prompt, 3, 'claude-instant-1.2', 10)
  if (response.trim().includes('4')) {
    return 'answer'
  } else if (response.trim().includes('3')) {
    return 'feedback'
  } else if (response.trim().includes('2')) {
    return 'tag'
  } else if (response.trim().includes('1')) {
    return 'question'
  } else {
    return 'none'
  }
}


export async function convertDatesToTimezone(datesString: string, timezone: string) {
  const prompt = `Human:

Convert all the following dates to the timezone "${timezone}". Do not change the rest of the text.

DO NOT SAY ANYTHING BUT THE CHANGED TEXT - NO "Here are the dates converted to..."

Text: "${datesString}"

Assistant:`;
  const convertedDate = await llm(prompt, 3, 'claude-2', 10_000)
  return convertedDate;
}

// convertDatesToTimezone(`| id  | created_at                    | text                                                                                                                                                                                                                                                                | user_id                              |
// | --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
// | 386 | 2023-09-12 03:22:14.770893+00 | Ate lentils, salmon, coconut milk, peanut butter, apple, kimchi                                                                                                                                                                                                     | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 385 | 2023-09-12 03:20:22.714625+00 | I enjoy meditation                                                                                                                                                                                                                                                  | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 384 | 2023-09-11 18:57:30.024009+00 | Just drank some chai                                                                                                                                                                                                                                                | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 383 | 2023-09-11 17:26:45.578228+00 | Drank athletic greens upon waking 3 hours ago                                                                                                                                                                                                                       | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 382 | 2023-09-11 17:26:30.228136+00 | Drank coffee an hour ago                                                                                                                                                                                                                                            | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 380 | 2023-09-11 15:46:17.313405+00 | 5                                                                                                                                                                                                                                                                   | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 373 | 2023-09-10 15:24:12.315613+00 | 5                                                                                                                                                                                                                                                                   | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 366 | 2023-09-09 22:57:55.566908+00 | elements: cup
// action: drinking                                                                                                                                                                                                                                      | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 363 | 2023-09-09 16:22:04.624664+00 | How do you feel today on a scale of 1 to 5? 😃
// 5                                                                                                                                                                                                                    | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 360 | 2023-09-09 14:43:51.631906+00 | Drinking cold coffee                                                                                                                                                                                                                                                | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 359 | 2023-09-09 14:42:25.199676+00 | Just meditated feel ok                                                                                                                                                                                                                                              | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 354 | 2023-09-09 04:51:18.056468+00 | Ate hummus falafel peanuts melon lettuce tomato                                                                                                                                                                                                                     | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 353 | 2023-09-09 02:14:04.526759+00 | elements: cabbage
// action: serving food
// text: Lem
// 야                                                                                                                                                                                                                  | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 352 | 2023-09-08 20:23:57.403106+00 | Now finishing my masala tea, added almond milk                                                                                                                                                                                                                      | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 351 | 2023-09-08 20:23:25.118131+00 | Lunch: burritos with chicken, curry, rice                                                                                                                                                                                                                           | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 350 | 2023-09-08 20:11:47.746618+00 | Kinda feel better after it                                                                                                                                                                                                                                          | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 349 | 2023-09-08 17:18:14.907401+00 | elements: masala chai
// action: masala chai
// text: Masala Chaj
// Black tea, ginger, cardamom\.
// cloves, nutmeg, black pepper
// Cacao
// Lion's Mane
// Cordyceps
// Chaga
// Reishi
// Cinnamon
// Turmeric
// Himalayan Salt
// Net Wt\. 1 lb 3 oz\. \(540g\)
// Support your local sunrise\.
// 4695° W | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 347 | 2023-09-08 16:01:21.24486+00  | Just drank cold coffee                                                                                                                                                                                                                                              | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 345 | 2023-09-08 15:00:37.026086+00 | How do you feel today on a scale of 1 to 5? 😃
// 3                                                                                                                                                                                                                    | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 344 | 2023-09-08 14:47:36.866394+00 | Climbing today                                                                                                                                                                                                                                                      | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 333 | 2023-09-08 04:56:37.831281+00 | Just took 500 mg of melatonin                                                                                                                                                                                                                                       | 20284713-5cd6-4199-8313-0d883f0711a1 |
// | 332 | 2023-09-08 04:56:15.109286+00 | For dinner I ate: chicken, eggs, broccoli, onions, garlic, cottage cheese, avocado, peanuts, melon                                                                                                                                                                  | 20284713-5cd6-4199-8313-0d883f0711a1 |`, 'America/Los_Angeles').then(console.log)