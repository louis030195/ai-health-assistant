import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { MetriportDevicesApi } from "@metriport/api-sdk";
import { syncHealthData } from '@/app/metriport';

// export const runtime = 'edge'
export const maxDuration = 300

// curl -X POST -d '{"metriportUserId": "0fa0ce80-1e29-44cf-b957-6f5c58ca33e9", "userId":"20284713-5cd6-4199-8313-0d883f0711a1","timezone":"America/Los_Angeles","fullName":"Louis","telegramChatId":"5776185278", "phone": "+...", "goal": "I want to improve my mood by practicing mindfulness and meditation."}' -H "Content-Type: application/json" http://localhost:3000/api/single-metriport

// this function should:
// 1. fetch the data from metriport api for the user for all providers
// 2. insert the data into supabase for the user

export async function POST(req: Request) {
  const { userId, timezone, metriportUserId } = await req.json()
  try {

    const metriportClient = new MetriportDevicesApi(process.env.METRIPORT_API_KEY!, {
      sandbox: false, // set to true to use the sandbox environment
    });

    // use user timezone
    // Error: Error: date must be in format YYYY-MM-DD!
    const usersDate = new Date(new Date().toLocaleDateString('en-US', { timeZone: timezone })).toISOString().split('T')[0];
    console.log('User date:', usersDate, timezone);

    const activitiesPromise = metriportClient.getActivityData(metriportUserId, usersDate);
    const biometricsPromise = metriportClient.getBiometricsData(metriportUserId, usersDate);
    const bodiesPromise = metriportClient.getBodyData(metriportUserId, usersDate);
    const nutritionPromise = metriportClient.getNutritionData(metriportUserId, usersDate);
    const sleepPromise = metriportClient.getSleepData(metriportUserId, usersDate);

    const [activities, biometrics, bodies, nutrition, sleep] = await Promise.all([activitiesPromise, biometricsPromise, bodiesPromise, nutritionPromise, sleepPromise]);

    await syncHealthData(activities, biometrics, bodies, nutrition, sleep, userId);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ message: "Error" }, { status: 200 });
  }
}


