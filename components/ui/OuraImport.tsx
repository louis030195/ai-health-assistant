"use client";
import { Session } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "./toaster";
import toast from "react-hot-toast";
import { CloudArrowDownIcon } from "@heroicons/react/20/solid";
import { useOuraToken } from "../useTokens";

const retryFetch = async (
    url: string,
    options: RequestInit,
    maxRetries: number = 3
) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response; // If response is successful, return it
        } catch (error) {
            // If we've reached the last retry and still have an error, throw it
            if (i === maxRetries - 1) throw error;
        }
    }
    throw new Error("Max retries reached for fetch request."); // If all retries are exhausted and no response
};


const OuraImport = ({ session }: { session: Session }) => {
    const userId = session.user.id;

    const [progress, setProgress] = useState(0);
    const [currentDay, setCurrentDay] = useState(0); // Keep track of the current day being imported
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { accessToken, setAccessToken, status } = useOuraToken(session.user.id)

    const handleClick = async () => {
        setProgress(0); // Reset progress
        setCurrentDay(0); // Reset the current day counter
        setErrorMessage(null); // Clear any previous error
        let e = null;
        toast.success("Importing your last 30 days of Oura data...");
        // Notify the start of the process
        const toastId = toast.loading("Starting data import...");

        for (let i = 0; i < 30; i++) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0];
            console.log("Importing sleep data for date: " + date);
            const response = await retryFetch("/auth/oura/import-sleep", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, date }),
            });

            if (!response.ok) {
                setErrorMessage("Failed to import sleep data for date: " + date);
                e = "Failed to import sleep data for date: " + date;
                toast.error("Failed to import sleep data for date: " + date, { id: toastId }); // Use the loading toast's ID to replace it with this error toast
                break; // Exit the loop if any request fails
            }

            // Update the current day being processed
            setCurrentDay(i + 1); // i starts from 0, so we add 1

            // Update the progress bar
            setProgress(((i + 1) / 30) * 100);
        }

        if (!e) {
            toast.success("Data import completed successfully!", { id: toastId }); // Replace the loading toast with a success toast
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <Toaster />
            <Button
                className=" text-white font-bold py-2 px-4 rounded"
                onClick={handleClick}
                disabled={!accessToken}
            >
                <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                Import Oura Data
            </Button>
            {/* small text below explaining why, when import */}
            <p className="text-gray-500 max-w-[50%] text-center">
                Import the last 30 days of Oura data into Mediar. This may take a few
                minutes. The rest of your data will be imported daily, automatically.
            </p>
            {/* hide upon reaching full progress */}
            {progress > 0 && progress < 100 && (
                <div className="items-center justify-center flex flex-col">
                    <p className="mt-2 text-gray-500">
                        Importing day {currentDay} out of 30
                    </p>
                    <Progress value={progress} className="w-[60%] mt-4" />
                </div>
            )}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
    );
};

export default OuraImport;
