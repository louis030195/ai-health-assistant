import { redirect } from "next/navigation";
import { getSession, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "../intro/GoToButton";
import NeurosityConnect from "@/components/NeurosityConnect";
import OuraConnect from "@/components/OuraConnect";
import { getOuraAccessTokenServer } from "@/app/oura-server";
import OuraImport from "@/components/ui/OuraImport";
import AppleHealthConnect from "@/components/AppleHealthConnect";
import MetriportConnect from "@/components/MetriportConnect";



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
        <div className="flex flex-col items-center justify-center mt-20 gap-2 lg:w-1/2 mx-auto w-3/4">
            <h2 className="text-lg font-bold mb-2">Connect Your Health Apps and Wearables</h2>
            <p className="text-sm text-gray-600 mb-4">To get the most out of Mediar, connect your health apps and wearables. This will allow us to provide personalized insights based on your health data.</p>
            <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md w-full">
                <AppleHealthConnect appStoreLink="https://testflight.apple.com/join/ofhHbnbd" />
                <p className="text-sm text-gray-600 mb-4">For Apple Health, you'll need to install our iOS app.</p>
            </div>
            <hr className="w-full my-4" /> {/* Divider */}

            <h2 className="text-lg font-bold mb-2">And/Or Connect All Other Health Apps</h2>
            <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md w-full">
                <h2 className="text-lg font-bold mb-2">Connect your health data</h2>
                <p className="text-sm text-gray-600 mb-4">Connect your health/fitness accounts to get your health data.</p>
                <MetriportConnect userId={session.user.id} />
            </div>
            <a href="mailto:louis@mediar.ai"
                className="text-center text-sm mt-2 underline text-blue-500">
                Use another device or health app? Contact us</a>
        </div>
    )
}

