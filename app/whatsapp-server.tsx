export const sendWhatsAppMessage = async (to: string, body: string) => {
    const from = process.env.TWILIO_PHONE_NUMBER
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
        },
        body: new URLSearchParams({
            From: `whatsapp:${from}`,
            Body: body,
            To: `whatsapp:${to}`,
        }).toString()
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to send WhatsApp message: ${response.status} ${response.statusText} ${text}`);
    }

    return response;
}