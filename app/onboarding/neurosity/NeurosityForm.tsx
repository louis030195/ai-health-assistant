'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

import { Session } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { neurosity } from '@/utils/neurosity-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';

interface Props {
    session: Session;
    className?: string;
}

export default function ConnectNeurosity({ session, className }: Props) {
    const supabase = createClientComponentClient<Database>()

    const [email, setEmail] = useState(session?.user?.email);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogged, setIsLogged] = useState(false);
    const router = useRouter();

    useEffect(() => {
        neurosity.focus().subscribe((r) => {
            console.log(r)
            setIsLogged(r !== null)
        })
    }, [])

    const handleConnect = async () => {
        if (isLogged) return toast.success('Connected to Neurosity!');
        // await toast.promise(neurosity.login({ email: email!, password }), {
        //     // success: 'Connected to Neurosity!',
        //     // error: (e) => e.toString().includes('Already') ?
        //         // undefined : //'Already connected to Neurosity' :
        //         // 'Could not connect to Neurosity',
        //     loading: 'Listening to your focus...',
        // }).catch(console.log);
        toast.loading('Connecting to your Neurosity...');
        await neurosity.logout()
        const onConnected = () => {
            toast.success('Listening to your focus...');
            // neurosity.calm().forEach(console.log)
            const { unsubscribe } = neurosity.focus().subscribe(async (focus) => {
                console.log("focus", focus);
                const nf = {
                    // created_at: focus.timestamp?.toString(),
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
                        unsubscribe();
                    } catch { }
                    console.log("unsubscribed");
                }
            });
        }

        neurosity.login({ email: email!, password }).then(() => {
            toast.dismiss()
            setError(''); // clear error
            onConnected()
        }).catch((e) => {
            console.log(e)
            if (e.toString().includes('Already')) return onConnected()
            toast.error('Could not connect to Neurosity')
        }).finally(() => setTimeout(() => toast.dismiss(), 2000));


        // router.push('/account');
        // router.refresh();
    };

    return (
        <div className={`flex-col space-y-10 ${className}`}>
            <Toaster />
            {/* Header */}
            <div className="text-center">
                <Image
                    // center 
                    className="mx-auto"
                    src="/neurosity.png" alt="neurosity" width="64" height="64"
                />
                <h1 className="text-3xl font-bold text-indigo-600">Record your focus</h1>
                <p className="text-lg text-gray-600">Connect your account to <Link
                    className="underline"
                    href="https://neurosity.co">Neurosity</Link> to save your focus.</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md p-10 max-w-md">

                {/* Email */}
                <input
                    className="border p-3 w-full mb-5 rounded-md text-gray-600"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password */}
                <input
                    className="border p-3 w-full mb-5 rounded-md text-gray-600"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Connect button */}
                <Button
                    className="transition duration-200 bg-indigo-500 text-white hover:bg-indigo-600 w-full py-3 rounded-md"
                    onClick={handleConnect}
                // disabled={!email || !password}
                >
                    Focus now
                </Button>

            </div>

        </div>
    );
}