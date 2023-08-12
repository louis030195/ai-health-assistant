import { redirect } from "next/navigation";
import { getOnboarding, getSession, getUserDetails, saveOnboarding } from "../../supabase-server";
import { GoToButton } from "./GoToButton";
import { LLMStoryDistraction } from "./LLMStoryDistraction";

export default async function Onboarding() {
    const session = await getSession();
    if (!session) return redirect('/signin');
    const hasOnboarded = await getOnboarding(session.user.id);
    if (hasOnboarded) {
        return redirect('/dashboard');
    }
    const { error } = await saveOnboarding(session.user.id);
    return (
        <div className="p-8 flex pb-16 md:pb-0 gap-6">
            <div className="bg-white z-10 w-full rounded-xl border p-4 shadow text-black">
                <LLMStoryDistraction />
            </div>
            <div className="bg-white z-10 w-full rounded-xl border p-4 shadow text-black">
                <h1 className="text-4xl mb-8">Quick tour</h1>
                <iframe src="https://link.excalidraw.com/p/readonly/399QBRzLgRKcd2oqVLNb" width="100%" height="550px"></iframe>
                <div className="flex gap-4 justify-end mt-8">
                    <GoToButton text="Next step" path="/onboarding/neurosity" />
                </div>
            </div>
        </div>
    );
}

