import { redirect } from "next/navigation";
import { getSession, getUserDetails } from "../../supabase-server";
import NeurosityForm from "./NeurosityForm";



export default async function Onboarding() {
    const [session, userDetails] = await Promise.all([
        getSession(),
        getUserDetails(),
    ]);

    const user = session?.user;

    if (!session) {
        return redirect('/signin');
    }
    return (
        // center stuff vertically and horizontally
        <div className="flex flex-col items-center justify-center h-screen">
            <NeurosityForm session={session} />
        </div>
    )
}

