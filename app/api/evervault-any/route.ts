
export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json()

  console.log('evervaulty', body)
  return new Response(JSON.stringify({ body }), {
    headers: { 'content-type': 'application/json' },
  })
}

