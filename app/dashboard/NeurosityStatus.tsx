'use client'
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Toaster } from 'react-hot-toast';

interface Props {
    userId: string
}

const NeurosityStatus = ({ userId }: Props) => {
    const [active, setActive] = useState(false);
    const [lastFocus, setLastFocus] = useState<number | null>(null); // <--- 1. New state for last recorded focus

    const supabase = createClientComponentClient()


    useEffect(() => {

        const checkUpdates = async () => {
            const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
            const { data, error } = await supabase
                .from('states')
                .select('created_at,probability') // replace with the actual column name for creation timestamp
                .gte('created_at', fiveMinutesAgo.toISOString())
                .eq('user_id', userId)
                // .eq('provider', 'neurosity')
                .gte('probability', 0.1)
                .limit(1);
            // const { count } = await supabase
            //     .from('states')
            //     .select('*', { count: 'exact', head: true })
            //     .eq('user_id', userId)

            console.log('data', data)
            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            if (data && data.length > 0) {
                setActive(true);
                setLastFocus(data[0].probability);  // <--- 2. Set the lastFocus value from the retrieved data
            } else {
                setActive(false);
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
                        `Receiving your brain activity ... Last recorded focus level: ${lastFocus?.toFixed(2)}` : // <--- 3. Displaying the focus level
                        'No activity has been received from your Neurosity, please power it, wear it, and make sure your Neurosity account is connected in the account tab. It can take up to 5 minutes to show up here.'
                }
            </p>
            {/* top right in parent */}
            {/* hidden on mobile */}
            <div className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hidden md:block">
                <HoverCard>
                    <HoverCardTrigger>
                        <QuestionMarkCircleIcon width={16} className="text-gray-500" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[400px] h-[600px]">
                        <iframe src="https://link.excalidraw.com/p/readonly/7cjnnH0EFBiojPwLWFK7" width="100%" height="50%"></iframe>
                        {/* @ts-ignore */}
                        <iframe width="100%" height="50%" src="https://www.youtube.com/embed/xfg3QK15k4g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </HoverCardContent>
                </HoverCard>
            </div>
            {/* top left in parent
            <ArrowPathIcon width={16}
                className="absolute top-0 left-0 mt-2 ml-2 text-gray-500 transform rotate-180 hover:cursor-pointer"
                onClick={forceListen} /> */}
        </div>
    );
};

export default NeurosityStatus;
