import { sendWhatsAppMessage } from '@/app/whatsapp-server';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge'



const welcomeMessage = (fullName?: string) => `🤖 Hi ${fullName}! It's Mediar, your health assistant! 👋 

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
    // get userId, phone, and token from the body
    const { userId, phone, full_name } = await req.json();
    console.log("Body:", userId, phone, full_name);


    const response = await sendWhatsAppMessage(phone, welcomeMessage(full_name));
    // const response = await sendWhatsAppMessageTemplate(phone, full_name);
    console.log("Message sent to:", userId, "with response status:", response.status);

    return NextResponse.json({ message: "Sent welcome message" }, { status: 200 });

}

// curl -X POST http://localhost:3000/api/phone-verified

// // sendWhatsAppMessage('+xxx', welcomeMessage('xx')).then(console.log).catch(console.error)

// const supabase = createClient<Database>(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_KEY!
//   )


async function sendMessagesAndUpdateUsers() {
    const supabase = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
    )

    const customMessage = `🙏 Hi awesome Mediar users! Louis here again. 

I wanted to say a huge THANK YOU for joining our early WhatsApp integration beta! I really appreciate you taking the time to try it out and provide feedback. 😊

I know there were a few hiccups with the WhatsApp and Oura syncing properly. Please accept my sincere apologies for that! 😓 Rest assured, we've sorted out those issues and everything should now be working smoothly. 🙌

As a token of thanks for your patience, I've created a special promo code "EARLY" just for you. Use it to get 40% off our Biohacker plan until tomorrow! 🔥

Our vision is to empower people worldwide to optimize their wellbeing through personalized insights. With your support, I know we'll get there! 🚀

We will launch on Product hunt tomorrow (in ~3 hours) and would love your support, please upvote at launch time! https://www.producthunt.com/products/mediar

Hit me up if you face any other issues or have any feedback ❤️. Wishing you stellar health and happiness! 🥦🧠💪`

    const { error, data: users } = await supabase
        .from('users')
        .select('id, phone, full_name')
        .gte('phone', '')

    if (error) {
        console.log("Error fetching users:", error.message);
        return;
    }

    console.log("Sending messages to users:", users);

    for (const user of users) {
        await sendWhatsAppMessage(user.phone!, welcomeMessage(user.full_name || ''));
        await sendWhatsAppMessage(user.phone!, customMessage);

        const { error: updateError } = await supabase
            .from('users')
            .update({ phone_verified: true })
            .eq('id', user.id);

        if (updateError) {
            console.log(`Error updating user ${user.id}:`, updateError.message);
        }
    }
}

// sendMessagesAndUpdateUsers().then(console.log).catch(console.error)

