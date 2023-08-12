import { redirect } from "next/navigation";
import { getSession, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "../intro/GoToButton";
import NeurosityConnect from "@/components/NeurosityConnect";



export default async function Onboarding() {
    const session = await getSession()
    if (!session?.user?.id) {
        return redirect('/signin');
    }
    const saveOnboardingServer = async (userId: string) => {
        'use server'
        const { error } = await saveOnboarding(userId);
        if (error) {
            console.error(error);
        }
    }
    return (
        // center stuff vertically and horizontally
        <div className="flex flex-col items-center mt-20 h-screen gap-4">
            <NeurosityConnect session={session} onboarding={true} />
            <GoToButton text="End the tour" path="/dashboard" session={session} onClick={saveOnboardingServer} />
        </div>
    )
}

