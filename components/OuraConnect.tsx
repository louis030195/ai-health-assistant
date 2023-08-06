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
    getOuraAccessToken: (code: string, scopes: string[]) => Promise<string>;
    session: Session;
}
export default function OuraConnect({ onboarding, className, getOuraAccessToken, session }: Props) {
    const { accessToken, setAccessToken } = useOuraToken(session.user.id)

    const handleConnect = () => {
        const clientId = process.env.NEXT_PUBLIC_OURA_OAUTH_CLIENT_ID;
        const redirectUri = getURL() +
            (
                onboarding === true ?
                    "onboarding/oura" :
                    "account"
            );
        // Step 1: Redirect user to Oura authorize URL
        const authorizeUrl = `https://cloud.ouraring.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
        window.location.href = authorizeUrl;
    };


    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const scopes = url.searchParams.get("scope")?.split(" ") || [];
        console.log('code', code);
        if (code) {
            // Step 2: Exchange code for access token
            getOuraAccessToken(code, scopes).then((accessToken) => {
                setAccessToken(accessToken);
            });
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
                <p className="text-lg text-gray-600">Connect your account to <Link
                    className="underline"
                    href="https://ouraring.com">Oura</Link> to get your ring data.</p>
            </div>

            <div className="space-y-4">

                {accessToken &&
                    // Show connected state
                    <div className='flex items-center space-x-2 justify-center'>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                        <span className="text-sm text-gray-400">Connected to Oura</span>
                    </div>
                }
                <Button
                    className="transition duration-200 bg-indigo-500 text-white hover:bg-indigo-600 w-full rounded-md"
                    onClick={handleConnect}
                >
                    Connect
                </Button>

            </div>

            {/* small text saying that oura features are coming soon */}
            <div className="text-center text-sm text-gray-500">
                <p>Oura features coming soon! Feel free to suggest any 🙏</p>
            </div>

        </div>
    );
}