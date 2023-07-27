'use client'
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import Button from '@/components/ui/Button';
import { GetStatesWithFunctionOptions } from '../supabase-server';

interface Props {
    session: Session;
    defaultStates: any[];
    getStates: (userId: string, options: GetStatesWithFunctionOptions) => Promise<any[]>;
}

function roundToTwo(num: number) {
    return Math.round(num * 100) / 100;
}

export const NeurosityFocusChart = ({ session, defaultStates, getStates }: Props) => {
    let [states, setStates] = useState<any[]>(defaultStates);

    // Modify your data to include an 'hour' field
    states = states.map(state => {
        const date = new Date(state.start_ts);
        return {
            ...state,
            hour: date.getUTCHours() + date.getMinutes() / 60
        };
    });

    const refreshState = async () => {
        const ns = await getStates(session.user.id, {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            day: new Date(),
        });
        setStates(ns);
    }

    const data = [
        {
            x: states.map(state => state.start_ts),
            // x: states.map(state => state.hour),
            y: states.map(state => state.avg_score),
            type: 'scatter',
            mode: 'lines',
            marker: { color: '#8884d8' },
            name: 'Focus'
        }
    ];

    const layout = {
        title: 'Focus history',
        xaxis: {
            title: 'Time',
            // range: [0, 24]
        },
        yaxis: {
            title: 'Score',
        }
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
                // @ts-ignore
                data={data}
                layout={layout}
                style={{ width: "600px", height: "300px" }}
            />
        </div>
    );
}
