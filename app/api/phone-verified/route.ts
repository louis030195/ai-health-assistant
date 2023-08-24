import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge'



const welcomeMessage = (fullName?: string) => `🤖 Hi${fullName ? ' ' + fullName : ''}! It's Mediar, your health assistant! 👋 

To help me understand best how events in your life affect your health, simply send me tags about your daily activities, moods, foods, workouts, etc. 

For example:

- ☕ Had coffee
- 😊 Feeling happy 
- 🍎 Ate an apple
- 🏋️‍♀️ Did 30 mins workout

Of course, just write on the go without emojis, I can also deal with grammar mistakes and typos! 🤓

You can also send me pictures of your meals, workouts, drinks, etc. 📸. I'll try to understand what's in the picture and tag it for you! 🤖

I'll use these tags to provide personalized daily insights on how to improve your focus, sleep, stress and general health! 🧘‍♀️🥰

If you want to know more about your health, just ask me questions like:
- How can I improve my sleep?
- How can I reduce my stress?
- What's my focus score?

If you have any feedback or questions ❓ about Mediar, just join the Discord community: https://discord.gg/pFKpxYpZEa or email 💌 louis@mediar.ai.

Let's unlock your full potential together! Sending tags is quick and easy - I'm excited to start learning more about you! ✨`

export async function POST(req: Request) {
    // get userId, phone, and token from the body
    const { userId, phone, full_name } = await req.json();
    console.log("Body:", userId, phone, full_name);


    // const response = await sendWhatsAppMessage(phone, welcomeMessage(full_name));
    const response = await sendWhatsAppMessageTemplate(phone, full_name);
    console.log("Message sent to:", userId, "with response status:", response.status);

    return NextResponse.json({ message: "Sent welcome message" }, { status: 200 });

}

// curl -X POST http://localhost:3000/api/phone-verified


// CONTENTVARIABLES=$(cat << EOF
//     {
//         "1": "Name"
//     }
//     EOF
//     )
    
//     curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" \
//     --data-urlencode "ContentSid=HXXXXXXXXX" \
//     --data-urlencode "From=MGXXXXXXXX" \
//     --data-urlencode "ContentVariables=$CONTENTVARIABLES" \
//     --data-urlencode "To=whatsapp:+18551234567" \
//     -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN


const sendWhatsAppMessageTemplate = async (to: string, name: string) => {
    const from = process.env.TWILIO_PHONE_NUMBER
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    console.log(`Sending WhatsApp message from ${from} to ${to}`);
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
        },
        body: new URLSearchParams({
            ContentSid: '',
            From: `whatsapp:${from}`,
            ContentVariables: JSON.stringify({ 1: name }),
            To: `whatsapp:${to}`,
        }).toString()
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to send WhatsApp message: ${response.status} ${response.statusText} ${text}`);
    }

    return response;
}
