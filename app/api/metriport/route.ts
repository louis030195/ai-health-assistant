import { llm } from "@/utils/llm"

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
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}