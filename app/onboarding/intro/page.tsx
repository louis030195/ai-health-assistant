import { redirect } from "next/navigation";
import { getSession, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToDashboardButton } from "./GoToDashboardButton";

export default async function Onboarding() {
    const session = await getSession();
    if (!session) return redirect('/signin');
    const { error } = await saveOnboarding(session.user.id);
    return (
        <div className="p-16 col-span-full flex-1 pb-16 md:pb-0">
            <div className="bg-white mx-auto z-10 max-w-xl rounded-xl border p-4 shadow text-black">
                <h1 className="text-4xl mb-8">Welcome to Mediar</h1>
                <iframe src="https://link.excalidraw.com/p/readonly/399QBRzLgRKcd2oqVLNb" width="100%" height="400px"></iframe>
                <div className="flex gap-4">
                    <GoToDashboardButton />
                </div>
            </div>
        </div>
    );
}

