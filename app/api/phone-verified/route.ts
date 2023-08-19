import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge'



const welcomeMessage = (fullName?: string) => `🤖 Hi${fullName ? ' ' + fullName : ''}! It's Mediar, your health assistant! 👋 

To help me understand you, simply send me tags about your daily activities, moods, foods, workouts, etc. 

For example:

- ☕ Had coffee
- 😊 Feeling happy 
- 🍎 Ate an apple
- 🏋️‍♀️ Did 30 mins workout

Of course, just write on the go without emojis, I can also deal with grammar mistakes and typos! 🤓

I'll use these tags to provide personalized daily insights on how to improve your focus, sleep, stress and general health! 🧘‍♀️🥰

If you want to know more about your health, just ask me questions like:
- How can I improve my sleep?
- How can I reduce my stress?
- What's my focus score?

If you have any feedback or questions ❓ about Mediar, just join the Discord community: https://discord.gg/pFKpxYpZEa or email 💌 louis@mediar.ai.

Let's unlock your full potential together! Sending tags is quick and easy - I'm excited to start learning more about you! ✨`

export async function POST(req: Request) {
    // get userId, phone, and token from the body
    const body = await req.json();
    console.log("Body:", body);
    // console.log(req.headers);

    const { userId, phone, full_name } = body.record;

    // get token from http header
    //  'x-invoke-query' => '%7B%22token%22%3A%22thisisatoken%22%7D',
    // const token = req.headers.get('x-invoke-query')?.split('token=')[1];

    // console.log("Token:", token);

    // // check if the token is valid
    // if (token !== 'thisisatoken') { // JUST A HACK
    //     return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    // }

    // check if phone_verified when from anything to true
    // body.type !== 'UPDATE' && body.table !== 'users' &&
    
    // console.log(body.record.phone_verified, body.old_record.phone_verified)
    // console.log(body.record.phone_verified === true && body.old_record.phone_verified !== true)
    if (body.record.phone_verified === true && body.old_record.phone_verified !== true) {
        // welcome the user
        const response = await sendWhatsAppMessage(phone, welcomeMessage(full_name));
        console.log("Message sent to:", userId, "with response status:", response.status);

        return NextResponse.json({ message: "Sent welcome message" }, { status: 200 });
    }
    return NextResponse.json({ message: "Phone still verified!" }, { status: 200 });

}

// curl -X POST http://localhost:3000/api/phone-verified
