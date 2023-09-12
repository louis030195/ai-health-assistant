import { checkWhatsAppVerification, startWhatsAppVerification } from "@/app/whatsapp-server";

export const runtime = 'edge'

export async function POST(req: Request) {
    const { to, code, id } = await req.json()
    try {
        const response = await checkWhatsAppVerification(to, code);
        if (response.status !== 'approved') return new Response("Error", { status: 400 });
        await fetch('/api/phone-verified', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: id,
                phone: to,
                full_name: ''
            })
        });
        return new Response("Success", { status: 200 });
    }
    catch (error) {
        console.log("Error:", error);
        return new Response("Error", { status: 500 });
    }
}