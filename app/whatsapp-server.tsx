
export const sendWhatsAppMessage = async (to: string, body: string, retryCount = 3): Promise<Response> => {
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
        console.error(`Failed to send WhatsApp message: ${response.status} ${response.statusText} ${text}`);
        if (retryCount > 0) {
            console.log(`Retrying... attempts left: ${retryCount - 1}`);
            await new Promise(r => setTimeout(r, 2000)); // wait for 2 seconds before retrying
            return sendWhatsAppMessage(to, body, retryCount - 1);
        } else {
            throw new Error(`Failed to send WhatsApp message after ${retryCount} attempts`);
        }
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


export interface Message {
    account_sid: string;
    api_version: string;
    body: string;
    date_created: string;
    date_sent: string;
    date_updated: string;
    direction: string;
    error_code: null | string;
    error_message: null | string;
    from: string;
    messaging_service_sid: null | string;
    num_media: string;
    num_segments: string;
    price: string;
    price_unit: string;
    sid: string;
    status: string;
    subresource_uris: {
        media: string;
        feedback: string;
    };
    tags: {
        campaign_name: string;
        message_type: string;
    };
    to: string;
    uri: string;
}

export interface ListMessagesResponse {
    end: number;
    first_page_uri: string;
    next_page_uri: string;
    page: number;
    page_size: number;
    previous_page_uri: string;
    messages: Message[];
}

export const listWhatsAppMessagesFromNumber = async (toNumber: string): Promise<Message[]> => {
    const from = process.env.TWILIO_PHONE_NUMBER
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const formattedDate = `${yesterday.getUTCFullYear()}-${('0' + (yesterday.getUTCMonth() + 1)).slice(-2)}-${('0' + yesterday.getUTCDate()).slice(-2)}`;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json?From=whatsapp:${from}&To=whatsapp:${toNumber}&DateSent>=${formattedDate}`
        .replace(/\+/g, '%2B');

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to list WhatsApp messages: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json() as ListMessagesResponse;
    return data.messages as Message[];
}
// listWhatsAppMessagesFromNumber("+...").then(console.log).catch(console.error);


