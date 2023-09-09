import { redirect } from "next/navigation";
import { getSession, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "../intro/GoToButton";
import NeurosityConnect from "@/components/NeurosityConnect";
import OuraConnect from "@/components/OuraConnect";
import { getOuraAccessTokenServer } from "@/app/oura-server";
import OuraImport from "@/components/ui/OuraImport";
import AppleHealthConnect from "@/components/AppleHealthConnect";



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
            <AppleHealthConnect appStoreLink="https://testflight.apple.com/join/ofhHbnbd" />
            <OuraConnect session={session} onboarding={true}
                // remove shadow
                className='w-4/5 shadow-none'
                getOuraAccessToken={getOuraAccessTokenServerServer} />
            <NeurosityConnect
                className='w-4/5 shadow-none'
                session={session} onboarding={true} />

            {/* <OuraImport session={session} /> */}
            {/* user an other device? contact us ... mailto:louis@mediar.ai */}
            <a href="mailto:louis@mediar.ai"
            // blue underline
                className="text-center text-sm mt-2 underline text-blue-500">
                Use another device or health app? Contact us</a>
        </div>
    )
}

