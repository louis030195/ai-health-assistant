'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';

import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useNeurosityToken } from './useTokens';
import posthog from 'posthog-js';

interface Props {
    session: Session;
    className?: string;
    onboarding?: boolean;
}

export default function NeurosityConnect({ session, className, onboarding }: Props) {
    const { customToken } = useNeurosityToken(session.user.id);

    const handleConnect = async () => {
        posthog.capture('neurosity-connect');

        const response = await fetch(`/auth/neurosity/url`, {
            method: 'POST',
            body: JSON.stringify({ onboarding })
        }).then(r => r.json())
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
            <div className="space-y-4 flex flex-col items-center">
                {
                    customToken &&
                    // display green dot and text
                    <div className='flex items-center space-x-2 text-center justify-center'>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping">
                        </div>
                        <span className="text-sm text-gray-400">Connected to Neurosity</span>
                    </div>
                }
                {/* Connect button */}
                <Button
                    className=" text-white  w-[80%] lg:w-[50%] mx-auto "
                    onClick={handleConnect}
                >
                    Connect
                </Button>


                <CheckboxWithText userId={session?.user?.id} />
            </div>

        </div>
    );
}


import { Checkbox } from "@/components/ui/checkbox"
import { Database } from '@/types_db';

export function CheckboxWithText({ userId }: { userId: string }) {
    const supabase = createClientComponentClient<Database>()
    const [checked, setChecked] = useState(false)
    const [userDetails, setUserDetails] = useState<any>(null)

    // on change, update supabase.users.metadata.neurosity.enabled settings for the current user
    const onCheckedChange = (checked: boolean) => {
        setChecked(checked)
        if (userId) {
            supabase
                .from('users')
                .update({ neurosity: { disabled: checked } })
                .eq('id', userId)
                .then(({ error }) => {
                    console.log('sat neurosity disabled to', checked)
                    if (error) {
                        console.error(error)
                    }
                })
        }
    }

    useEffect(() => {
        supabase
            .from('users')
            .select('*')
            .single().then(({ data, error }) => {
                if (error) {
                    console.error(error)
                }
                if (data) {
                    setUserDetails(data)
                    console.log(data)
                    // @ts-ignore
                    setChecked(data?.oura?.disabled === true)
                }
            })
    }, [])

    return (
        <div className="items-top justify-center flex space-x-2 text-black">
            <Checkbox
                disabled={!userId}
                id="neurosity-check" checked={checked} onCheckedChange={onCheckedChange} />
            <div className="grid gap-1.5 leading-none">
                <label
                    htmlFor="neurosity-check"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I don't use Neurosity
                </label>
                <p className="text-sm text-muted-foreground text-gray-500">
                    If you don't plan to use a Neurosity device you can hide everything related to it on the dashboard.
                </p>
            </div>
        </div>
    )
}
