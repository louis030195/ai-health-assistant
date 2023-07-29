'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
    text: string;
    path: string;
}
export const GoToButton = ({ text, path }: Props) => {
    const router = useRouter();
    return (
        <Button
            onClick={() => router.push(path)}
        >
            {text}
        </Button>
    )
}