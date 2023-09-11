import { syncHealthData } from "@/app/metriport"
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

      const activities = user?.activities || []
      const biometrics = user?.biometrics || []
      const bodies = user?.bodies || []
      const nutrition = user?.nutrition || []
      const sleep = user?.sleep || []
      await syncHealthData(activities, biometrics, bodies, nutrition, sleep, userId);

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
