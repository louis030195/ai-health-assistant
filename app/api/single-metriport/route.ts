import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { MetriportDevicesApi } from "@metriport/api-sdk";

// export const runtime = 'edge'
export const maxDuration = 300

// curl -X POST -d '{"metriportUserId": "0fa0ce80-1e29-44cf-b957-6f5c58ca33e9", "userId":"20284713-5cd6-4199-8313-0d883f0711a1","timezone":"America/Los_Angeles","fullName":"Louis","telegramChatId":"5776185278", "phone": "+...", "goal": "I want to improve my mood by practicing mindfulness and meditation."}' -H "Content-Type: application/json" http://localhost:3000/api/single-metriport

// this function should:
// 1. fetch the data from metriport api for the user for all providers
// 2. insert the data into supabase for the user

export async function POST(req: Request) {
  const { userId, timezone, fullName, telegramChatId, phone, goal, metriportUserId } = await req.json()
  try {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    )

    const metriportClient = new MetriportDevicesApi(process.env.METRIPORT_API_KEY!, {
      sandbox: true, // set to true to use the sandbox environment
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

    // Process biometrics data
    const biometricsData = biometrics ?? []
    for (const biometric of biometricsData) {
      const { metadata, heart_rate, respiration } = biometric

      const { date, hour, source } = metadata
      const start_time = hour ? `${date}T${hour}:00Z` : `${date}T00:00Z`
      const end_time = start_time // For simplicity, let's assume end_time is the same as start_time

      const { error } = await supabase
        .from('biometrics')
        .upsert({
          // @ts-ignore
          user_id: userId,
          start_time,
          end_time,
          heart_rate, // Insert the whole heart_rate JSON
          respiration, // Insert the whole respiration JSON
          date,
          hour,
          source,
          data_source: metadata.data_source,
          error: metadata.error
          // Add other biometrics fields here as needed
        }, { onConflict: 'start_time, end_time, user_id' })
      if (error) {
        console.error('Error inserting biometrics:', error)
      }
    }

    // Process sleep data
    const sleepData = sleep ?? []
    for (const sleep of sleepData) {
      const { start_time, end_time, durations, biometrics, metadata } = sleep


      // @ts-ignore
      const { error } = await supabase
        .from('sleep')
        .upsert({
          // @ts-ignore
          user_id: userId,
          start_time,
          end_time,
          durations: durations,
          biometrics: biometrics,
          date: metadata.date,
          hour: metadata.hour,
          source: metadata.source,
          data_source: metadata.data_source,
          error: metadata.error
        }, { onConflict: 'start_time, end_time, user_id' })
      if (error) {
        console.error('Error inserting sleep:', error)
      }
    }

    // Process nutrition data
    const nutritionData = nutrition ?? []
    for (const nutrition of nutritionData ?? []) {
      for (const food of nutrition.foods ?? []) {
        const {
          name,
          brand,
          nutrition_facts, // insert the whole nutrition JSON
        } = food

        const { error } = await supabase
          .from('foods')
          .upsert({
            // @ts-ignore
            user_id: userId,
            start_time: `${nutrition.metadata.date}T${nutrition.metadata.hour}:00Z`,
            end_time: `${nutrition.metadata.date}T${nutrition.metadata.hour}:00Z`,
            name,
            brand,
            nutrition_facts,
            date: nutrition.metadata.date,
            hour: nutrition.metadata.hour,
            source: nutrition.metadata.source,
            data_source: nutrition.metadata.data_source,
            error: nutrition.metadata.error
          }, { onConflict: 'start_time, end_time, user_id' })
        if (error) {
          console.error('Error inserting food:', error)
        }
      }
    }

    // Process activity data
    const activityData = activities ?? []
    for (const activity of activityData) {
      const { summary, metadata } = activity

      // @ts-ignore
      const { error } = await supabase
        .from('activities')
        .upsert({
          // @ts-ignore
          user_id: userId,
          start_time: metadata.hour ? `${metadata.date}T${metadata.hour}:00Z` : `${metadata.date}T00:00Z`,
          end_time: metadata.hour ? `${metadata.date}T${metadata.hour}:00Z` : `${metadata.date}T00:00Z`,
          biometrics: summary?.biometrics,
          movement: summary?.movement,
          energy_expenditure: summary?.energy_expenditure,
          date: metadata.date,
          hour: metadata.hour,
          durations: summary?.durations,
          source: metadata.source,
          error: metadata.error
        }, { onConflict: 'start_time, end_time, user_id' })
      if (error) {
        console.error('Error inserting activity:', error)
      }
    }

    // Process body data
    const bodyData = bodies ?? []
    for (const body of bodyData) {
      const { metadata, ...otherFields } = body

      const { date, hour, source } = metadata
      const start_time = hour ? `${date}T${hour}:00Z` : `${date}T00:00Z`
      const end_time = start_time // For simplicity, let's assume end_time is the same as start_time

      const { error } = await supabase
        .from('body')
        .upsert({
          // @ts-ignore
          user_id: userId,
          start_time,
          end_time,
          date,
          hour,
          source,
          data_source: metadata.data_source?.toString(),
          error: metadata.error
          // Add other body fields here as needed
        }, { onConflict: 'start_time, end_time, user_id' })
      if (error) {
        console.error('Error inserting body data:', error)
      }
    }
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error:", error, userId, timezone, fullName, telegramChatId);
    return NextResponse.json({ message: "Error" }, { status: 200 });
  }
}


