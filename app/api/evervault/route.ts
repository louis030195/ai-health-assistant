import { llm } from "@/utils/llm"

// export const runtime = 'edge'
export const maxDuration = 300

export async function POST(req: Request) {
  // message: string, retries = MAX_RETRIES, model = 'claude-2', max_tokens_to_sample = 500, anonymise = false
  const body = await req.json()

  console.log('evervaulty', body)
  // add \n\nAssistant: to the prompt
  const prompt = body.prompt.trim() + "\n\nAssistant:"
  const response = await llm(prompt, 3, body.model || "claude-2", body.max_tokens_to_sample || 500)
  return new Response(JSON.stringify({ completion: response }), {
    headers: { 'content-type': 'application/json' },
  })
}

