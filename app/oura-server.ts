export const getOuraAccessToken = async (code: string) => {
    const clientId = process.env.NEXT_PUBLIC_OURA_OAUTH_CLIENT_ID!;
    const clientSecret = process.env.OURA_OAUTH_CLIENT_SECRET!;

    // Step 3: Exchange code for access token
    const tokenUrl = 'https://api.ouraring.com/oauth/token';

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(process.env.OURA_OAUTH_CLIENT_REDIRECT_URI!)}`
    })

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch OAuth token: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json();
    return { accessToken: data.access_token, refreshToken: data.refresh_token };
}


interface OuraPersonalInfo {
    id: string;
    age: number;
    weight: number;
    height: number;
    biological_sex: string;
    email: string;
}

export const getOuraPersonalInfo = async (accessToken: string) => {
    const response = await fetch('https://api.ouraring.com/v2/usercollection/personal_info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch personal info: ${response.status} ${response.statusText} ${text}`);
    }
    const data = await response.json();
    return data as OuraPersonalInfo;
}

type OuraDataType = "tag" | "workout" | "session" | "sleep" | "daily_sleep" | "daily_readiness" | "daily_activity";

interface OuraCreateWebhookSubscriptionResponse {
    id: string;
    callback_url: string;
    event_type: string;
    data_type: OuraDataType;
    expiration_time: string;
}
export async function createOuraWebhookSubscription() {
    const clientId = process.env.NEXT_PUBLIC_OURA_OAUTH_CLIENT_ID!;
    const clientSecret = process.env.OURA_OAUTH_CLIENT_SECRET!;

    const url = 'https://api.ouraring.com/v2/webhook/subscription'
    const body = {
        callback_url: 'https://mediar.ai/auth/oura/webhook-verification',
        verification_token: 'abc123', // ?
        event_type: 'create',
        data_type: 'tag' // TODO all stuff
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-client-id': clientId,
            'x-client-secret': clientSecret
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create webhook subscription: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json()
    return data as OuraCreateWebhookSubscriptionResponse
}



interface OuraListWebhookSubscriptionResponse {
    id: string;
    callback_url: string;
    event_type: string;
    data_type: OuraDataType;
    expiration_time: string;
}
export async function listOuraWebhookSubscriptions() {
    const clientId = process.env.NEXT_PUBLIC_OURA_OAUTH_CLIENT_ID!;
    const clientSecret = process.env.OURA_OAUTH_CLIENT_SECRET!;

    const url = 'https://api.ouraring.com/v2/webhook/subscription'
    const options = {
        method: 'GET',
        headers: {
            'x-client-id': clientId,
            'x-client-secret': clientSecret
        }
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to list webhook subscriptions: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json()
    return data as OuraListWebhookSubscriptionResponse[]
}

export async function deleteOuraWebhookSubscription(id: string) {
    const clientId = process.env.NEXT_PUBLIC_OURA_OAUTH_CLIENT_ID!;
    const clientSecret = process.env.OURA_OAUTH_CLIENT_SECRET!;

    const url = `https://api.ouraring.com/v2/webhook/subscription/${id}`
    const options = {
        method: 'DELETE',
        headers: {
            'x-client-id': clientId,
            'x-client-secret': clientSecret
        }
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete webhook subscription: ${response.status} ${response.statusText} ${text}`);
    }
}

export async function deleteOuraWebhookSubscriptionOfType(type: OuraDataType) {
    try {
        const subscriptions = await listOuraWebhookSubscriptions()
        console.log('subscriptions', subscriptions)
        const subscription = subscriptions.find(s => s.data_type === type)
        if (subscription) {
            await deleteOuraWebhookSubscription(subscription.id)
        }
    } catch (e) {
        console.error(e)
    }
}



export interface OuraSleep {
    id: string;
    average_breath: number;
    average_heart_rate: number;
    average_hrv: number;
    awake_time: number;
    bedtime_end: string;
    bedtime_start: string;
    day: string;
    deep_sleep_duration: number;
    efficiency: number;
    heart_rate: {
        interval: number;
        items: number[];
        timestamp: string;
    };
    hrv: {
        interval: number;
        items: number[];
        timestamp: string;
    };
    latency: number;
    light_sleep_duration: number;
    low_battery_alert: boolean;
    lowest_heart_rate: number;
    movement_30_sec: string;
    period: number;
    readiness: {
        contributors: {
            activity_balance: string;
            body_temperature: string;
            hrv_balance: string;
            previous_day_activity: string;
            previous_night: string;
            recovery_index: string;
            resting_heart_rate: string;
            sleep_balance: string;
        };
        score: number;
        temperature_deviation: number;
        temperature_trend_deviation: number;
    };
    readiness_score_delta: number;
    rem_sleep_duration: number;
    restless_periods: number;
    sleep_phase_5_min: string;
    sleep_score_delta: number;
    time_in_bed: number;
    total_sleep_duration: number;
    type: string;
}

interface OuraSleepResponse {
    data: OuraSleep[];
    next_token: string;
}

export async function listOuraSleep(token: string, startDate: string, endDate: string) {
    const url = `https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${startDate}&end_date=${endDate}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to list sleep: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json()
    console.log("erhfjkwfherw", Object.keys(data))
    return data as OuraSleepResponse
}

export async function listDailySleep(token: string) {
    // curl -X GET "https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=$(date +'%Y-%m-%d')&end_date=$(date +'%Y-%m-%d')" \
    // today formatted like 2023-08-06
    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date().toISOString().split('T')[0]
    const sleep: OuraSleep[] = []

    let response = await listOuraSleep(token, startDate, endDate)

    while (response.next_token) {
        sleep.push(...response.data)
        response = await listOuraSleep(token, startDate, endDate)
    }

    sleep.push(...response.data)
    return sleep
}

