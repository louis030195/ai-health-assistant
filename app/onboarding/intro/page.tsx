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

    return (
        // height almost full screen size
        <div className="p-8 flex pb-16 md:pb-0 gap-6 min-h-[calc(40vh-4rem)] md:flex-row flex-col">
            <div className="bg-white z-10 w-full rounded-xl border p-4 shadow text-black">
                <LLMStoryDistraction className="min-h-[calc(70vh-4rem)] max-h-[calc(70vh-4rem)]" />
            </div>
            <div className="bg-white z-10 w-full rounded-xl border p-4 shadow text-black">
            <iframe src="https://link.excalidraw.com/readonly/6pHEffYoOyh7iAVLxzgr" width="100%" height="95%"></iframe>
                {/* <iframe src="https://link.excalidraw.com/p/readonly/399QBRzLgRKcd2oqVLNb" width="100%" height="95%"></iframe> */}
            </div>
        </div>
    );
}

