export const sendTelegramMessage = async (to: string, text: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = { chat_id: to, text };
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Error sending Telegram message: ${response.statusText}`);
    }

    return response.json();
}

import { kv } from '@vercel/kv';

export const startTelegramVerification = async (to: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // generate a 6 digit code
    await kv.set(to, code);
    await sendTelegramMessage(to, `Your verification code is ${code}`);
}

export const checkTelegramVerification = async (to: string, code: string) => {
    const storedCode = await kv.get(to);
    if (storedCode === code) {
        await kv.del(to); // delete the code from Vercel KV
        return true;
    } else {
        return false;
    }
}