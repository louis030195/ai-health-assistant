'use client'

import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface Props {
    text: string;
    path: string;
    session: Session;
    onClick?: (userId: string) => void;
}
export const GoToButton = ({ text, path, session, onClick }: Props) => {
    const router = useRouter();
    return (
        <Button
            onClick={() => {
                onClick && onClick(session!.user!.id)
                router.push(path)
            }}
        >
            {text}
        </Button>
    )
}