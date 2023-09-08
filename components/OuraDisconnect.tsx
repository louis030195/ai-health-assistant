'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { getURL } from '@/utils/helpers';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useOuraToken } from './useTokens';
import { Session } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Props {
    revokeOuraAccessToken: (accessToken: string) => Promise<boolean>;
    className?: string;
    session: Session;
}

export default function OuraDisconnect({ revokeOuraAccessToken, className, session }: Props) {
    const { accessToken, setAccessToken, status } = useOuraToken(session.user.id)

    const handleDisconnect = async () => {
        if (accessToken) {
            try {
                const toastId = toast.loading('Disconnecting your Oura account...');
                const result = await revokeOuraAccessToken(accessToken);
                if (!result) {
                    throw new Error('Failed to revoke access token');
                }
                const supabase = createClientComponentClient()

                const { error } = await supabase.from('tokens').delete().match({ mediar_user_id: session.user.id, provider: 'oura' })
                console.log(error)
                toast.success('Successfully disconnected your Oura account', { id: toastId });
                setAccessToken(undefined);
            } catch (error) {
                console.error('Failed to disconnect Oura:', error);
                toast.error('Failed to disconnect your Oura account, please reach out to us');
            }
        }
    };

    return (
        <div className={`items-top justify-center flex space-x-2 text-black ${className}`}>
            <Toaster />
            <Button
                onClick={handleDisconnect}
                disabled={!accessToken}
                className="w-[80%] lg:w-[50%]"
            >
                Disconnect your Oura account
            </Button>

        </div>
    );
}