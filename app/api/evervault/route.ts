import { llm } from "@/utils/llm"

export const runtime = 'edge'

export async function POST(req: Request) {
  // message: string, retries = MAX_RETRIES, model = 'claude-2', max_tokens_to_sample = 500, anonymise = false
  const body = await req.json()

  console.log('evervaulty', body)
  const response = await llm(body.prompt, 3, body.model || "claude-2", body.max_tokens_to_sample || 500)
  return new Response(JSON.stringify({ completion: response }), {
    headers: { 'content-type': 'application/json' },
  })
}

