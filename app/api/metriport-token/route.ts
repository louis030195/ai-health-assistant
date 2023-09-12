import { Database } from "@/types_db";
import { MetriportDevicesApi, MetriportMedicalApi } from "@metriport/api-sdk";
import { createClient } from "@supabase/supabase-js";

// export const runtime = 'edge'
// export const maxDuration = 300

const metriportClient = new MetriportDevicesApi(process.env.METRIPORT_API_KEY!, {
  sandbox: false, // set to true to use the sandbox environment
});

export async function POST(req: Request) {
  const { userId } = await req.json()
  if (!userId) {
    return new Response(null, {
      status: 400
    })
  }

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  // create user in Metriport and get the Metriport user ID
  const metriportUserId = await metriportClient.getMetriportUserId(userId);

  // save token to "users"

  const { error } = await supabase
    .from('users')
    .update({ metriport_user_id: metriportUserId })
    .eq('id', userId)

  if (error) {
    console.error(error)
    return new Response(null, {
      status: 500
    })
  }

  // create a session token to be used in the Metriport Connect widget
  const connectToken = await metriportClient.getConnectToken(metriportUserId);

  console.log('metriport', { userId, metriportUserId, connectToken })
  return new Response(JSON.stringify({
    token: connectToken
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}