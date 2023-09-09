import { Database } from "@/types_db"
import { createClient } from "@supabase/supabase-js"
import { NextRequest } from "next/server"

export const runtime = 'edge'
// export const maxDuration = 300

export async function POST(req: Request) {
  const body = await req.json()
  const webhookKey = process.env.METRIPORT_WEBHOOK_KEY

  // Verify the x-webhook-key header
  if (req.headers.get('x-webhook-key') !== webhookKey) {
    return new Response(null, {
      status: 401
    })
  }

  // Respond to the ping message
  if (body.ping) {
    return new Response(JSON.stringify({ pong: body.ping }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  console.log('metriport', body)

  const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

  // Check for user health data
  if (body.meta.type === 'devices.health-data') {

    const usersData = body.users

    const promises = usersData.map(async (user: any) => {

      const { userId } = user

      // Check if user exists in the 'users' table
      const { data: userExists, error } = await supabase
        .from('users')
        .select('metriport_user_id, id')
        .eq('metriport_user_id', userId)
        .single()

      if (error) {
        console.error('Error checking user existence:', error)
        return  // Skip to the next user
      }

      if (!userExists) {
        console.log(`User with ID ${userId} does not exist. Skipping...`)
        return  // Skip to the next user
      }

      // Process biometrics data
      const biometricsData = user?.biometrics ?? []
      for (const biometric of biometricsData) {
        const { metadata, heart_rate, respiration } = biometric

        const { date, hour, source } = metadata
        const start_time = `${date}T${hour}:00Z` // Construct start_time from date and hour
        const end_time = start_time // For simplicity, let's assume end_time is the same as start_time

        await supabase
          .from('biometrics')
          .insert({
            user_id: userExists.id,
            start_time,
            end_time,
            heart_rate, // Insert the whole heart_rate JSON
            respiration // Insert the whole respiration JSON
            // Add other biometrics fields here as needed
          })
      }

      // Process sleep data
      const sleepData = user?.sleep ?? []
      for (const sleep of sleepData) {
        const { start_time, end_time, durations, biometrics } = sleep

        const { avg_bpm } = biometrics.heart_rate

        const {
          total_seconds,
          awake_seconds,
          deep_seconds,
          rem_seconds,
          light_seconds
        } = durations

        await supabase
          .from('sleep')
          .insert({
            user_id: userExists.id,
            start_time,
            end_time,
            total_minutes: total_seconds / 60,
            awake_minutes: awake_seconds / 60,
            deep_minutes: deep_seconds / 60,
            rem_minutes: rem_seconds / 60,
            light_minutes: light_seconds / 60,
            avg_heart_rate: avg_bpm
          })
      }

      const nutritionData = user?.nutrition ?? []


      for (const food of nutritionData.foods) {

        const {
          start_time, // use start_time from sleep before food
          end_time, // and end_time from sleep after food
          name,
          brand,
          servings,
          calories,
          nutrition_facts // insert the whole nutrition JSON
        } = food

        await supabase
          .from('foods')
          .insert({
            user_id: userExists.id,
            start_time,
            end_time,
            name,
            brand,
            servings,
            calories,
            nutrition_facts
          })

      }
      const activityData = user?.activity ?? []
      for (const activity of activityData) {

        const {
          start_time,
          end_time,
          name,
          type
        } = activity.summary

        const {
          active_minutes,
          heart_rate_zones
        } = activity.summary.durations

        const {
          avg_heart_rate,
          max_heart_rate
        } = activity.summary.biometrics

        await supabase
          .from('activities')
          .insert({
            user_id: userExists.id,
            name,
            type,
            start_time,
            end_time,
            active_minutes,
            avg_heart_rate,
            max_heart_rate,
            heart_rate_zones // insert the whole JSON
          })

      }
    })

    // // @ts-ignore
    // req.waitUntil(Promise.all(promises))
    await Promise.all(promises)


    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
