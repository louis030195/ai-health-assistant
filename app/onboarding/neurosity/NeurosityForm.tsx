'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

import { Session, SupabaseClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { Input } from '@/components/ui/input';
import { Neurosity } from '@neurosity/sdk';
import { unsubscribe } from 'diagnostics_channel';
import useOAuthResult from '@/components/useAuth';
import { PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';

interface Props {
    session: Session;
    className?: string;
}
const neurosity = new Neurosity();


interface MyFuncOptions {
    session: Session,
    neurosity: Neurosity,
    supabase: SupabaseClient, // replace with correct type
    timeoutMs?: number
}

const listenToBrain = async ({ session, neurosity, supabase, timeoutMs = 3000 }: MyFuncOptions) => {
    let isReceivingFocus = false;

    const u1 = neurosity.brainwaves("powerByBand").subscribe(async (powerByBand) => {
        isReceivingFocus = true;

        console.log("powerByBand", powerByBand);
        const nf = {
            metadata: {
                ...powerByBand
            },
            user_id: session.user.id,
        }
        const { error } = await supabase.from('states').insert(nf)
        if (error) {
            console.log("error", error);
            try {
                u1.unsubscribe();
            } catch { }
            console.log("unsubscribed");
        }
    })

    const u2 = neurosity.focus().subscribe(async (focus) => {
        isReceivingFocus = true;

        console.log("focus", focus);
        const nf = {
            probability: focus.probability,
            metadata: {
                label: focus.label,
            },
            user_id: session.user.id,
        }
        const { error } = await supabase.from('states').insert(nf)
        if (error) {
            console.log("error", error);
            try {
                u2.unsubscribe();
            } catch { }
            console.log("unsubscribed");
        }
    });

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isReceivingFocus) {
                resolve(null);
            } else {
                u1.unsubscribe();
                u2.unsubscribe();
                reject(new Error("No data received from brainwaves in the specified timeout"));
            }
        }, timeoutMs);
    });

    return { unsubscribe1: u1.unsubscribe, unsubscribe2: u2.unsubscribe };
}


export default function ConnectNeurosity({ session, className }: Props) {
    const supabase = createClientComponentClient<Database>()

    const [error, setError] = useState('');
    const [isLogged, setIsLogged] = useState(false);
    const [isReceivingFocus, setIsReceivingFocus] = useState(false);
    const router = useRouter();
    const { customToken } = useOAuthResult(session.user.id);

    const handleConnect = async () => {

        const onConnected = async () => {
            toast.loading('Listening to your focus...');
            listenToBrain({ session, neurosity, supabase, timeoutMs: 100_000 }).catch((e) => {
                toast.dismiss()
                toast.error(
                    'Could not connect to your Neurosity, make sure the battery is charged and the headband is on your head'
                );
            }).then((_) => {
                toast.dismiss()
                toast.success('Connected to your Neurosity');
            })
        }
        await neurosity.logout()
        neurosity.login({
            customToken: customToken!,
        }).then(() => {
            toast.dismiss()
            setError(''); // clear error
            onConnected()
        }).catch((e) => {
            console.log(e)
            if (e.toString().includes('Already')) return onConnected()
            toast.error(
                e.message || 'Could not connect to your Neurosity'
            );
            toast.error('Make sure to connect to your Neurosity account in your account settings')
            setIsReceivingFocus(false)
        }).finally(() => setTimeout(() => toast.dismiss(), 2000));


    };

    return (
        <div className={`flex-col ${className}`}>
            <Toaster />

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

            <Button
                onClick={handleConnect}
                className="mb-2 bg-indigo-600 text-white rounded"
                disabled={!customToken}
            >
                <Image
                    // center 
                    className="mx-auto"
                    src="/neurosity.png" alt="neurosity" width="32" height="32"
                />
                Record your mind
            </Button>
            <p className="mb-3 text-sm text-gray-500">
                This will record data about your brain in order to provide you insights
            </p>
            {
                !customToken && <p className="mb-3 text-sm text-gray-500">
                    Please connect to your Neurosity account in your account settings
                </p>
            }

        </div>
    );
}