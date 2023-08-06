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

