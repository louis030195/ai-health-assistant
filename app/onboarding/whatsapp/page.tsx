import { redirect } from "next/navigation";
import { getActiveProductsWithPrices, getSession, getSubscription, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "../intro/GoToButton";
import NeurosityConnect from "@/components/NeurosityConnect";
import OuraConnect from "@/components/OuraConnect";
import { getOuraAccessTokenServer } from "@/app/oura-server";
import WhatsappConnect from "@/components/ui/WhatsappConnect";
import { checkWhatsAppVerification, startWhatsAppVerification } from "@/app/whatsapp-server";


export default async function Onboarding() {
    const session = await getSession()
    if (!session?.user?.id) {
        return redirect('/signin');
    }
    const [subscription, userDetails] = await Promise.all([
        getSubscription(),
        getUserDetails()
    ]);
    const startVerificationServer = async (to: string) => {
        'use server'
        return startWhatsAppVerification(to)
    }
    const checkVerificationServer = async (to: string, code: string) => {
        'use server'
        return checkWhatsAppVerification(to, code)
    }
    const onFinished = async () => {
        'use server'
        await saveOnboarding(session.user.id);
    }
    return (
        // center stuff vertically and horizontally
        <div className="flex flex-col items-center justify-center mt-20 gap-20">

            <WhatsappConnect session={session} subscription={subscription || undefined} userDetails={userDetails || undefined}
                startVerification={startVerificationServer} verifyOtp={checkVerificationServer} />

            <GoToButton path="/dashboard" session={session} text="Finish" onClick={onFinished} />
        </div>
    )
}

