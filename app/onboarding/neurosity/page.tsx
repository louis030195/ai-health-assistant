import { redirect } from "next/navigation";
import { getSession, getUserDetails } from "../../supabase-server";
import NeurosityForm from "./NeurosityForm";
import { GoToButton } from "../intro/GoToButton";
import NeurosityConnect from "@/components/NeurosityConnect";



export default async function Onboarding() {
    const session = await getSession()
    
    if (!session) {
        return redirect('/signin');
    }
    return (
        // center stuff vertically and horizontally
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <NeurosityConnect session={session} />
        </div>
    )
}

