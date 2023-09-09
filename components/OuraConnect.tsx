'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { getURL } from '@/utils/helpers';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useOuraToken } from './useTokens';
import { Session } from '@supabase/supabase-js';

interface Props {
    onboarding?: boolean;
    className?: string;
    getOuraAccessToken: (code: string, scopes: string[], redirectUri: string) => Promise<string>;
    session: Session;
}
export default function OuraConnect({ onboarding, className, getOuraAccessToken, session }: Props) {
    const { accessToken, setAccessToken, status } = useOuraToken(session.user.id)
    const redirectUri = getURL() +
        (
            onboarding === true ?
                "onboarding/oura" :
                "account"
        );
    const handleConnect = () => {
        const clientId = process.env.NEXT_PUBLIC_OURA_OAUTH_CLIENT_ID;

        console.log('redirectUri', redirectUri)
        // Step 1: Redirect user to Oura authorize URL
        const authorizeUrl = `https://cloud.ouraring.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
        window.location.href = authorizeUrl;
    };


    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const scopes = url.searchParams.get("scope")?.split(" ") || [];
        if (code) {
            // Step 2: Exchange code for access token
            getOuraAccessToken(code, scopes, redirectUri).then((accessToken) => {
                setAccessToken(accessToken);
            });
            // remove code from url to prevent reusing it
            window.history.replaceState({}, document.title, redirectUri);
        }
    }, []);




    return (
        <div className={`bg-white rounded-lg shadow-md p-6 flex-col space-y-5 ${className}`}>
            <Toaster />

            {/* Header */}
            <div className="text-center">
                <Image
                    // center 
                    className="mx-auto"
                    src="/oura.png" alt="oura" width="64" height="64"
                />
                <h1 className="text-3xl font-bold text-indigo-600">Connect your Ouraring</h1>
                {/* <h2 className="text-1xl font-bold text-red-600">Unfortunately we have too many Oura users atm and disabled Oura connection temporarily for new users. <br></br>Feel free to contact us if you have questions</h2> */}
                <p className="text-lg text-gray-600">Connect your account to <Link
                    className="underline"
                    href="https://ouraring.com">Oura</Link> to get your ring data.</p>
            </div>

            <div className="space-y-4 flex flex-col items-center">
                {/* TODO: broken */}
                {/* {status === false &&
                    <div className='flex items-center space-x-2 justify-center text-red-500'>
                        <span className="text-sm">Connection invalid. Please reconnect.</span>
                    </div>
                }
                {status !== false && accessToken &&
                    // Show connected state
                    <div className='flex items-center space-x-2 justify-center'>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                        <span className="text-sm text-gray-400">Connected to Oura</span>
                    </div>
                } */}
                <Button
                    className="text-white mx-auto w-[80%] lg:w-[50%]"
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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
                .update({ oura: { disabled: checked } })
                .eq('id', userId)
                .then(({ error }) => {
                    console.log('sat oura disabled to', checked)
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
                    // @ts-ignore
                    setChecked(data?.oura?.disabled === true)
                }
            })
    }, [])

    return (
        <div className="items-top justify-center flex space-x-2 text-black">
            <Checkbox
                disabled={!userId}
                id="oura-check" checked={checked} onCheckedChange={onCheckedChange} />
            <div className="grid gap-1.5 leading-none">
                <label
                    htmlFor="oura-check"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I don't use Ouraring
                </label>
                <p className="text-sm text-muted-foreground text-gray-500">
                    If you don't plan to use a Ouraring ring you can hide everything related to it on the dashboard.
                </p>
            </div>
        </div>
    )
}