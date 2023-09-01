"use client"

import { useState } from 'react';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react";



const examples = [
    "I want to improve my mood by practicing mindfulness and meditation.",
    "I aim to increase my energy levels by incorporating regular exercise into my routine.",
    "My goal is to improve the quality of my sleep by maintaining a consistent sleep schedule.",
    "I want to reduce my anxiety levels by learning and applying stress management techniques.",
    "I aim to reduce my physical pain by seeking appropriate medical treatment and practicing pain management techniques.",
    "My goal is to improve my digestive issues by maintaining a balanced and healthy diet.",
    "I want to reduce my symptoms by following my doctor's advice and taking prescribed medication regularly.",
    "I aim to increase my productivity by improving my time management skills and maintaining a healthy work-life balance."
];

export function GoalInput({ userDetails }: { userDetails: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClientComponentClient()
    const [inputValue, setInputValue] = useState(userDetails.goal);

    const handleExampleClick = (example: string) => {
        setInputValue(example);
    };

    async function onSubmit() {
        setIsLoading(true);
        const { error } = await supabase.from('users').update({ goal: inputValue }).match({ id: userDetails.id })
        if (error) {
            toast({
                title: "Error",
                description: "Could not save goal.",
            })
        } else {
            toast({
                title: "Success",
                description: "Goal saved successfully.",
            })
        }
        setIsLoading(false);

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-1/2"
                >
                    Set Goal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Set your goal</DialogTitle>
                    <DialogDescription>
                        Define your personal goal here. Click save when you're done.
                    </DialogDescription>
                    <DialogDescription>
                        Your goal will influence the insights of the AI, the questions asked, and the prompts given to you. You can update your goal here at any time.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-wrap overflow-x-auto gap-2 mb-4 whitespace-nowrap">
                        {examples.map((example) => (
                            <span
                                key={example}
                                onClick={() => handleExampleClick(example)}
                                className="cursor-pointer inline-flex items-center rounded-lg bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 sm:whitespace-nowrap whitespace-normal"
                            >
                                {example}
                            </span>
                        ))}
                    </div>
                    <Textarea placeholder="Improve mood" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button type="submit"
                        className="w-1/2 mx-auto"
                        onClick={() => onSubmit()}>
                        Save Goal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}