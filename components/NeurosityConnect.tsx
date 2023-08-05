'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';

import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import useOAuthResult from './useAuth';
import posthog from 'posthog-js';

interface Props {
    session: Session;
    className?: string;
}

export default function NeurosityConnect({ session, className }: Props) {
    const { customToken } = useOAuthResult(session.user.id);
    const router = useRouter();

    const handleConnect = async () => {
        posthog.capture('neurosity-connect');

        const supabase = createClientComponentClient()
        await supabase.from('tokens').delete().match({ user_id: session.user.id })
        const response = await fetch(`/auth/neurosity/url`).then(r => r.json())
        if ("url" in response) {
            // Takes the url returned by the cloud function and redirects the browser to the Neurosity OAuth sign-in page
            // window.location.href = response.url;
            router.push(response.url);
            // window.location.href = response.url
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

                {/* Connect button */}
                <Button
                    className="transition duration-200 bg-indigo-500 text-white hover:bg-indigo-600 w-full rounded-md"
                    onClick={handleConnect}
                >
                    Connect
                </Button>

                {
                    customToken &&
                    // display green dot and text
                    <div className='flex items-center space-x-2 text-center justify-center'>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping">
                        </div>
                        <span className="text-sm text-gray-400">Connected to Neurosity</span>
                    </div>
                }
            </div>

            {/* warn the user that this will disconnect him due to a bug that is going to be fixed */}
            {/* and that he has to login and come back here */}
            <div className="text-sm text-gray-500">
                <p>⚠️ Due to a bug, you will have to login again and come back here.
                    We apologize for the inconvenience.
                    This will be fixed soon.</p>
            </div>

        </div>
    );
}
