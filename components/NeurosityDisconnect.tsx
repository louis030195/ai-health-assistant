'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { getURL } from '@/utils/helpers';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useNeurosityToken, useOuraToken } from './useTokens';
import { Session } from '@supabase/supabase-js';
import { Neurosity } from '@neurosity/sdk';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Props {
    session: Session;
}

export default function NeurosityDisconnect({ session }: Props) {
    const { customToken } = useNeurosityToken(session.user.id);
    const handleDisconnect = async () => {
        if (customToken) {

            try {
                const toastId = toast.loading('Disconnecting your Neurosity account...');
                const neurosity = new Neurosity()
                await neurosity.login({ customToken: customToken })
                const result = await neurosity.removeOAuthAccess()
                if (!result) {
                    throw new Error('Failed to disconnect Neurosity');
                }
                const supabase = createClientComponentClient()

                const { error } = await supabase.from('tokens').delete().match({ mediar_user_id: session.user.id, provider: 'neurosity' })

                console.log(error)
                toast.success('Successfully disconnected your Neurosity account', { id: toastId });
            } catch (error) {
                console.error('Failed to disconnect Neurosity:', error);
                toast.error('Failed to disconnect your Neurosity account, please reach out to us');
            }
        }
    };

    return (
        <div >
            <Toaster />
            <Button
                onClick={handleDisconnect}
                disabled={!customToken}
                className="w-[400px]"
            >
                Disconnect your Neurosity account
            </Button>

        </div>
    );
}