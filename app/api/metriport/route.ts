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

  let promises: Promise<any>[] = []
  // Check for user health data
  if (body.meta.type === 'devices.health-data') {

    const usersData = body.users

    promises = usersData.map(async (user: any) => {

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

        const { error } = await supabase
          .from('biometrics')
          .upsert({
            user_id: userExists.id,
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
          }, { onConflict: 'start_time' })
        if (error) {
          console.error('Error inserting biometrics:', error)
        }
      }
      // Process sleep data
      const sleepData = user?.sleep ?? []
      for (const sleep of sleepData) {
        const { start_time, end_time, durations, biometrics, metadata } = sleep

        const { avg_bpm } = biometrics?.heart_rate ?? { avg_bpm: null }

        const {
          total_seconds,
          awake_seconds,
          deep_seconds,
          rem_seconds,
          light_seconds
        } = durations

        const { error } = await supabase
          .from('sleep')
          .upsert({
            user_id: userExists.id,
            start_time,
            end_time,
            total_minutes: total_seconds / 60,
            awake_minutes: awake_seconds / 60,
            deep_minutes: deep_seconds / 60,
            rem_minutes: rem_seconds / 60,
            light_minutes: light_seconds / 60,
            avg_heart_rate: avg_bpm,
            date: metadata.date,
            hour: metadata.hour,
            source: metadata.source,
            data_source: metadata.data_source,
            error: metadata.error
          }, { onConflict: 'start_time' })
        if (error) {
          console.error('Error inserting sleep:', error)
        }
      }

      // Process nutrition data
      const nutritionData = user?.nutrition ?? []
      for (const food of nutritionData?.foods ?? []) {
        const {
          start_time, // use start_time from sleep before food
          end_time, // and end_time from sleep after food
          name,
          brand,
          servings,
          calories,
          nutrition_facts, // insert the whole nutrition JSON
          metadata
        } = food

        const { error } = await supabase
          .from('foods')
          .upsert({
            user_id: userExists.id,
            start_time,
            end_time,
            name,
            brand,
            servings,
            calories,
            nutrition_facts,
            date: metadata.date,
            hour: metadata.hour,
            source: metadata.source,
            data_source: metadata.data_source,
            error: metadata.error
          }, { onConflict: 'start_time' })
        if (error) {
          console.error('Error inserting food:', error)
        }
      }

      // Process activity data
      const activityData = user?.activity ?? []
      for (const activity of activityData) {
        const { summary, metadata } = activity

        // Check if durations exists and contains active_minutes
        if (summary?.durations?.active_minutes) {
          const {
            start_time,
            end_time,
            name,
            type
          } = summary
          const {
            active_minutes,
            heart_rate_zones
          } = summary.durations

          const {
            avg_heart_rate,
            max_heart_rate
          } = summary.biometrics

          const { error } = await supabase
            .from('activities')
            .upsert({
              user_id: userExists.id,
              name,
              type,
              start_time,
              end_time,
              active_minutes,
              avg_heart_rate,
              max_heart_rate,
              heart_rate_zones, // insert the whole JSON
              date: metadata.date,
              hour: metadata.hour,
              source: metadata.source,
              data_source: metadata.data_source,
              error: metadata.error
            }, { onConflict: 'start_time' })
          if (error) {
            console.error('Error inserting activity:', error)
          }
        } else if (summary?.energy_expenditure) {
          const {
            energy_expenditure
          } = summary
          const start_time = `${metadata.date}T${metadata.hour}:00Z`
          const { error } = await supabase
            .from('activities')
            .upsert({
              user_id: userExists.id,
              start_time: start_time,
              energy_expenditure: energy_expenditure,
              date: metadata.date,
              hour: metadata.hour,
              source: metadata.source,
              data_source: metadata.data_source,
              error: metadata.error
            }, { onConflict: 'start_time' })
          if (error) {
            console.error('Error inserting activity:', error)
          }
        }
      }
    })

    // // @ts-ignore
    // req.waitUntil(Promise.all(promises))



  }
  await Promise.all(promises)

  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
