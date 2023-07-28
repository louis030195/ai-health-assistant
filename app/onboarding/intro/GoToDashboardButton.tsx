'use client'

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export const GoToDashboardButton = () => {
    const router = useRouter();
    return (
        <Button
            className="px-4 py-2 mx-auto"
            onClick={() => router.push('/dashboard')}
        >
            Go to Dashboard
        </Button>
    )
}