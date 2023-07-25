'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { neurosity } from '@/utils/neurosity-client';

interface Props {
    session: Session;
}

export default function ConnectNeurosity({ session }: Props) {

    const [email, setEmail] = useState(session?.user?.email);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogged, setIsLogged] = useState(false);
    const router = useRouter();
    // const supabase = createClientComponentClient()

    useEffect(() => {
        neurosity.onAuthStateChanged().subscribe((r) => {
            console.log(r)
            setIsLogged(r !== null)
        })
    }, [])

    console.log('session')
    const handleConnect = async () => {
        console.log(email, password)
        if (isLogged) return toast.success('Connected to Neurosity!');
        await toast.promise(neurosity.login({ email: email!, password }), {
            success: 'Connected to Neurosity!',
            error: (e) => e.toString().includes('Already') ?
                'Already connected to Neurosity' :
                'Could not connect to Neurosity',
            loading: 'Connecting to Neurosity...',
        })

        // 
        // const { data } = await supabase.from('todos').select()

        // unsubscribe();
        setError(''); // clear error
        // toast.success('Connected to Neurosity!');

        router.push('/account');
        router.refresh();
    };

    return (
        <div className="flex-col space-y-10">
            <Toaster />
            {/* Header */}
            <div className="text-center">
                <Image
                    // center 
                    className="mx-auto"
                    src="/neurosity.png" alt="neurosity" width="64" height="64"
                />
                <h1 className="text-3xl font-bold text-indigo-600">Connect to Neurosity</h1>
                <p className="text-lg text-gray-600">Connect your account to <Link
                    className="underline"
                    href="https://neurosity.co">Neurosity</Link> to get started.</p>
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
                    Connect to Neurosity
                </Button>

            </div>

        </div>
    );
}