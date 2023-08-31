export const sendWhatsAppMessage = async (to: string, body: string) => {
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
            From: `whatsapp:${from}`,
            Body: body,
            To: `whatsapp:${to}`,
        }).toString()
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to send WhatsApp message: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json()
    console.log("WhatsApp message sent successfully", data);

    return response;
}


export interface VerificationData {
    sid: string;
    service_sid: string;
    account_sid: string;
    to: string;
    channel: string;
    status: string;
    valid: boolean;
    date_created: string;
    date_updated: string;
    lookup: object;
    amount: null;
    payee: null;
    send_code_attempts: Array<{
        time: string;
        channel: string;
        attempt_sid: string;
    }>;
    sna: null;
    url: string;
}
  
export const startWhatsAppVerification = async (to: string) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceId = process.env.TWILIO_VERIFY_SERVICE_SID!;

    console.log(`Starting WhatsApp verification for ${to}`);
    const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceId}/Verifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
        },
        body: new URLSearchParams({
            To: `whatsapp:${to}`,
            Channel: 'whatsapp'
        }).toString()
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to start WhatsApp verification: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json()
    return data as VerificationData;
}

export interface VerificationResponse {
    sid: string;
    service_sid: string;
    account_sid: string;
    to: string;
    channel: string;
    status: string;
    valid: boolean;
    amount: null;
    payee: null;
    sna_attempts_error_codes: any[];
    date_created: string;
    date_updated: string;
}
export const checkWhatsAppVerification = async (to: string, code: string) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceId = process.env.TWILIO_VERIFY_SERVICE_SID!;

    console.log(`Checking verification code for ${to} with code ${code}`);
    const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceId}/VerificationCheck`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
        },
        body: new URLSearchParams({
            To: `whatsapp:${to}`,
            Code: code
        }).toString()
    });

    console.log(response);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to check WhatsApp verification: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json()
    return data as VerificationResponse;
}


