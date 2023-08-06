'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const NeurosityStatus = () => {
    const [active, setActive] = useState(false);
    const supabase = createClientComponentClient()

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
        <div className="flex flex-col justify-center items-center gap-2 p-4 bg-white rounded-lg shadow-lg">
            <div className={`w-4 h-4 rounded-full ${active ? 'bg-green-500' : 'bg-gray-500'} animate-pulse`}></div>
            <p className="text-sm text-gray-500 max-w-xs text-center">
                {
                    active ?
                        'Receiving your brain activity ...' :
                        'No activity has been received from your Neurosity, please power it, wear it, and make sure your Neurosity account is connected in the account tab'
                }
            </p>
        </div>
    );
};

export default NeurosityStatus;
