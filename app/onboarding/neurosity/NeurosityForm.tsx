'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { Input } from '@/components/ui/input';
import { Neurosity } from '@neurosity/sdk';
import { unsubscribe } from 'diagnostics_channel';

interface Props {
    session: Session;
    className?: string;
}
const neurosity = new Neurosity();

const getAvgSignalQuality = (values: any) => {
    const statusValue: any = { "great": 3, "good": 2, "bad": 1 };

    let totalSignalQuality = values.reduce((total: any, channel: any) => {
        return total + statusValue[channel.status];
    }, 0);

    return totalSignalQuality / values.length;
}


// Function to convert numeric score to string status
function qualityScoreToString(score: number) {
    if (score >= 2.5) {
        return "great";
    } else if (score >= 1.5) {
        return "good";
    } else {
        return "bad";
    }
}

type DeviceStatusProps = {
    metrics: {
        state: "online" | "offline" | "shuttingOff" | "updating" | "booting",
        sleepMode: boolean,
        sleepModeReason: "updating" | "charging" | null,
        charging: boolean,
        battery: number,
        lastHeartbeat: number,
        ssid: string,
        claimedBy: string
    }
};

const DeviceStatus: React.FC<DeviceStatusProps> = ({ metrics }) => {
    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-2">Device Status</h2>
            <p><strong>State:</strong> {metrics.state}</p>
            <p><strong>Sleep Mode:</strong> {metrics.sleepMode ? "On" : "Off"} {metrics.sleepMode && <span>- Reason: {metrics.sleepModeReason}</span>}</p>
            <p><strong>Charging:</strong> {metrics.charging ? "Yes" : "No"}</p>
            <p><strong>Battery Level:</strong> {metrics.battery}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${metrics.battery}%` }}></div>
            </div>
            <p><strong>Last Heartbeat:</strong> {new Date(metrics.lastHeartbeat).toLocaleString()}</p>
            <p><strong>SSID:</strong> {metrics.ssid}</p>
            <p><strong>Claimed By:</strong> {metrics.claimedBy}</p>
        </div>
    );
};


export default function ConnectNeurosity({ session, className }: Props) {
    const supabase = createClientComponentClient<Database>()

    const [error, setError] = useState('');
    const [isLogged, setIsLogged] = useState(false);
    const [isReceivingFocus, setIsReceivingFocus] = useState(false);
    const router = useRouter();


    const handleConnect = async () => {

        toast.loading('Connecting to your Neurosity...');
        let u1: Function, u2: Function = () => { }
        const onConnected = () => {
            toast.success('Listening to your focus...');
            const { unsubscribe: u1 } = neurosity.brainwaves("powerByBand").subscribe(async (powerByBand) => {
                setIsReceivingFocus(true)
                console.log("powerByBand", powerByBand);
                const nf = {
                    // created_at: focus.timestamp?.toString(),
                    // probability: focus.probability,
                    metadata: {
                        ...powerByBand
                    },
                    user_id: session.user.id,
                }
                const { error } = await supabase.from('states').insert(nf)
                if (error) {
                    console.log("error", error);
                    try {
                        u1();
                    } catch { }
                    console.log("unsubscribed");
                }
            })
            const { unsubscribe: u2 } = neurosity.focus().subscribe(async (focus) => {
                setIsReceivingFocus(true)
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
                        u2();
                    } catch { }
                    console.log("unsubscribed");
                }
            });
        }

        neurosity.login({
            customToken: localStorage.getItem('access_token') || ''
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
            u1();
            u2();
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

        </div>
    );
}