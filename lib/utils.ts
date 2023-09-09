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

export async function anonymiseUser (user: any) {
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

