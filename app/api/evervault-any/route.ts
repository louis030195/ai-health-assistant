
export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json()

  console.log('evervaulty', body)
  return new Response(JSON.stringify({ ...body }), {
    headers: { 'content-type': 'application/json' },
  })
}

/* 
user like 

const user = {
  id: 'qwde-dsds-ewew',
  timezone: 'America/New_York',
  full_name: 'Bobby',
  telegram_chat_id: 123456789,
  goal: 'lose weight w Alice',
}

*/




// curl -X POST -d '{"timezone": "America/New_York","full_name": "Bobby","goal": "lose weight w Alice"}' -H "Content-Type: application/json" https://mediar-ai.relay.evervault.com/api/evervault-any

