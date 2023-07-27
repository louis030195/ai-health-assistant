'use client'
import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import Button from '@/components/ui/Button';
import { GetProcessedBrainwavesOptions } from '../supabase-server';

interface Props {
    session: Session;
    defaultBrainwaves: any[];
    getBrainwaves: (userId: string, options?: GetProcessedBrainwavesOptions) => Promise<any[]>;
}
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d00000', '#804000', '#00ff00'];

export const NeurosityBrainwaveChart = ({ session, defaultBrainwaves, getBrainwaves }: Props) => {
    let [states, setStates] = useState<any[]>(defaultBrainwaves);

    states = states.map(state => {
        const date = new Date(state.created_at);
        return {
            ...state,
            hour: date.getUTCHours() + date.getMinutes() / 60
        };
    });

    const refreshState = async () => {
        const ns = await getBrainwaves(session.user.id, {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            day: new Date(),
        });
        setStates(ns);
    }

    console.log('brain', states)

    const data = new Array(8).fill(0).map((value, index) => ({
        // convert timestamp to human readable format
        x: states.map(s => new Date(s.timestamp)),
        y: states.map(s => s[`gamma_${index}`]),
        mode: 'lines',
        name: `Gamma ${index}`,
        line: { color: colors[index] }
    }));

    const layout = {
        title: 'Gamma brainwaves history',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Amplitude' },
        autosize: false,
        width: 600,
        height: 300,
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-end">
                <Button
                    onClick={refreshState}>
                    <ArrowPathIcon
                        width={20}
                        height={20}
                    />
                </Button>
            </div>
            <Plot
                data={data}
                layout={layout}
            />
            <p className="mb-3 text-sm text-gray-500">
                Gamma waves are associated with peak concentration, alertness, creativity, and positive mood states.<br />
                <a href='https://www.perplexity.ai/search/1f007e06-bfd8-4100-a191-551a7edf69d2?s=c' target='_blank' className='text-blue-500'> Learn more</a>
            </p>
        </div>
    );
}
