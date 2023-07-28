'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { neurosity } from '@/utils/neurosity-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';

interface Props {
    session: Session;
    className?: string;
}

export default function NeurosityConnect({ session, className }: Props) {
    const supabase = createClientComponentClient<Database>()

    const [error, setError] = useState('');
    const [isLogged, setIsLogged] = useState(false);
    const [isReceivingFocus, setIsReceivingFocus] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const { unsubscribe } = neurosity.focus().subscribe((r) => {
            console.log(r)
            setIsLogged(r !== null)
        })
        return () => {
            try {
                unsubscribe()
            } catch { }
        }
    }, [])

    const handleConnect = async () => {
        // fetch(`/functions/get-neurosity-oauth-url`)
        // .then(({ data }) => {
        //   if ("url" in data) {
        //     // Takes the url returned by the cloud function and redirects the browser to the Neurosity OAuth sign-in page
        //     window.location.href = data.url;
        //   } else {
        //     console.error(`Error: Did not receive url`);
        //   }
        // })
        // .catch((error) => {
        //   console.error(error.message);
        // });
        const response = await fetch(`/auth/neurosity/url`).then(r => r.json())
        console.log(response)
        if ("url" in response) {
            // Takes the url returned by the cloud function and redirects the browser to the Neurosity OAuth sign-in page
            window.location.href = response.url;
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6  flex-col space-y-5 ${className}`}>
            <Toaster />
            {/* Header */}
            <div className="text-center">
                <Image
                    // center 
                    className="mx-auto"
                    src="/neurosity.png" alt="neurosity" width="64" height="64"
                />
                <h1 className="text-3xl font-bold text-indigo-600">Connect your Neurosity</h1>
                <p className="text-lg text-gray-600">Connect your account to <Link
                    className="underline"
                    href="https://neurosity.co">Neurosity</Link> to record your mind.</p>
            </div>

            {/* Form */}
            <div className="space-y-4">

                {/* display a green dot blinking if receiving focus */}
                <div className="flex justify-center">
                    {
                        isReceivingFocus && <div className='flex items-center space-x-2'
                        ><div className="w-3 h-3 bg-green-500 rounded-full animate-ping">
                            </div>
                            <span className="text-gray-400">Recording your mind</span>
                        </div>
                    }
                </div>

                {/* Connect button */}
                <Button
                    className="transition duration-200 bg-indigo-500 text-white hover:bg-indigo-600 w-full rounded-md"
                    onClick={handleConnect}
                >
                    Connect
                </Button>
            </div>

        </div>
    );
}