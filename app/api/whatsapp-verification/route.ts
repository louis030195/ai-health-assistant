import { startWhatsAppVerification } from "@/app/whatsapp-server";

export const runtime = 'edge'

export async function POST(req: Request) {
    const { to } = await req.json()
    try {
        await startWhatsAppVerification(to);
        return new Response("Success", { status: 200 });
    }
    catch (error) {
        console.log("Error:", error);
        return new Response("Error", { status: 500 });
    }
}