import { redirect } from "next/navigation";
import { getSession, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "../intro/GoToButton";
import NeurosityConnect from "@/components/NeurosityConnect";
import OuraConnect from "@/components/OuraConnect";
import { getOuraAccessTokenServer } from "@/app/oura-server";



export default async function Onboarding() {
    const session = await getSession()
    if (!session?.user?.id) {
        return redirect('/signin');
    }
    const getOuraAccessTokenServerServer = async (code: string, scopes: string[], redirectUri: string) => {
        'use server'
        return getOuraAccessTokenServer(code, scopes, redirectUri)
    }

    return (
        // center stuff vertically and horizontally
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
            <OuraConnect session={session} onboarding={true} className='w-2/5' getOuraAccessToken={getOuraAccessTokenServerServer} />
            <GoToButton path="/dashboard" session={session} text="Finish" />
        </div>
    )
}

