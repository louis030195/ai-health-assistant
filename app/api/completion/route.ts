// ./app/api/chat/route.js
import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
    basePath: "https://28b6-2a01-e0a-3ee-1cb0-505a-5158-140c-80f8.ngrok-free.app/v1",
    apiKey: "EMPTY",
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: any) {
    // const { messages } = await req.json()
    // const response = await openai.createChatCompletion({
    //     model: 'TheBloke/Nous-Hermes-13B-GGML',
    //     stream: true,
    //     messages
    // })
    // const stream = OpenAIStream(response)
    // return new StreamingTextResponse(stream)
    const { prompt } = await req.json()
    const response = await openai.createCompletion({
        model: 'TheBloke/Nous-Hermes-13B-GGML',
        stream: true,
        prompt: prompt,
    })
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
}
