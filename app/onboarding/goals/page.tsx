import { redirect } from "next/navigation";
import { getSession, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "../intro/GoToButton";
import NeurosityConnect from "@/components/NeurosityConnect";
import OuraConnect from "@/components/OuraConnect";
import { getOuraAccessTokenServer } from "@/app/oura-server";
import OuraImport from "@/components/ui/OuraImport";
import AppleHealthConnect from "@/components/AppleHealthConnect";
import { GoalInput } from "@/app/dashboard/GoalInput";



export default async function Onboarding() {
    const session = await getSession()
    const userDetails = await getUserDetails();

    if (!session?.user?.id) {
        return redirect('/signin');
    }
    const getOuraAccessTokenServerServer = async (code: string, scopes: string[], redirectUri: string) => {
        'use server'
        return getOuraAccessTokenServer(code, scopes, redirectUri)
    }

    return (
        // center stuff vertically and horizontally
        <div className="flex flex-col items-center justify-center min-w-screen min-h-[70vh] gap-2">
            <div className="m-auto flex flex-col items-center justify-center gap-2">
                <p className="text-center text-lg font-bold mb-4">
                    Setting a goal will allow Mediar to personalize its behavior to help you get closer to your goal. 🎯🚀
                </p>
                <GoalInput userDetails={userDetails} />
            </div>
        </div>
    )
}

