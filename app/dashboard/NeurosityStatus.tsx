'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ArrowPathIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
    userId: string
}

const NeurosityStatus = ({ userId }: Props) => {
    const [active, setActive] = useState(false);
    const supabase = createClientComponentClient()

    const forceListen = async () => {
        // simply tweak a token row will trigger a change
        const { error } = await supabase
            .from('tokens')
            .update({ status: { valid: true, updated_at: new Date().toISOString() } })
            .eq('user_id', userId)

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        toast.loading('Force-checking if your Neurosity is connected ...', {
            duration: 2000,
        })
    }

    useEffect(() => {

        const checkUpdates = async () => {
            const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
            const { data, error } = await supabase
                .from('states')
                .select('created_at') // replace with the actual column name for creation timestamp
                .gte('created_at', fiveMinutesAgo.toISOString())
                .limit(1);

            console.log('data', data);
            if (error) {
                console.error('Error fetching data:', error);
                return;
            }
            setActive(data && data.length > 0)
        };

        checkUpdates();
        const intervalId = setInterval(checkUpdates, 5 * 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="relative flex flex-col justify-center items-center gap-2 p-4 bg-white rounded-lg shadow-lg">
            <Toaster />
            <div className={`w-4 h-4 rounded-full ${active ? 'bg-green-500' : 'bg-gray-500'} animate-pulse`}></div>
            <p className="text-sm text-gray-500 max-w-xs text-center">
                {
                    active ?
                        'Receiving your brain activity ...' :
                        'No activity has been received from your Neurosity, please power it, wear it, and make sure your Neurosity account is connected in the account tab. It can take up to 5 minutes to show up here.'
                }
            </p>
            {/* top right in parent */}
            <div className="absolute top-0 right-0 mt-2 mr-2">
                <HoverCard>
                    <HoverCardTrigger>
                        <QuestionMarkCircleIcon width={16} className="text-gray-500" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-96 h-96">
                        <iframe src="https://link.excalidraw.com/p/readonly/7cjnnH0EFBiojPwLWFK7" width="100%" height="100%"></iframe>
                    </HoverCardContent>
                </HoverCard>
            </div>
            {/* top left in parent */}
            <ArrowPathIcon width={16}
                className="absolute top-0 left-0 mt-2 ml-2 text-gray-500 transform rotate-180 hover:cursor-pointer"
                onClick={forceListen} />
        </div>
    );
};

export default NeurosityStatus;
