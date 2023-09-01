import { redirect } from "next/navigation";
import { getActiveProductsWithPrices, getSession, getSubscription, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "../intro/GoToButton";
import { sendTelegramMessage } from "@/app/telegram-server";
import TelegramConnect from "@/components/ui/TelegramConnect";


export default async function Onboarding() {
    const session = await getSession()
    if (!session?.user?.id) {
        return redirect('/signin');
    }
    const [subscription, userDetails] = await Promise.all([
        getSubscription(),
        getUserDetails()
    ]);
    const onFinished = async () => {
        'use server'
        await saveOnboarding(session.user.id);
    }

    const sendTelegramMessageServer = async (to: string, text: string) => {
        'use server'
        return sendTelegramMessage(to, text)
    }
    return (
        // center stuff vertically and horizontally
        <div className="flex flex-col items-center justify-center mt-20 gap-10">
            <p className="text-xl font-bold text-center">
                You can skip this step if you don't use Telegram and use WhatsApp instead.
            </p>
            <TelegramConnect session={session} subscription={subscription || undefined} userDetails={userDetails || undefined}
                sendTelegramMessage={sendTelegramMessageServer}
                className='shadow-none'
            />

            <GoToButton path="/dashboard" session={session} text="Finish" onClick={onFinished} />
        </div>
    )
}

