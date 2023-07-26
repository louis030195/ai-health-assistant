'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import Button from '@/components/ui/Button';

interface Props {
    session: Session;
    defaultStates: any[];
    getStates: () => Promise<any[]>;
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
        const ns = await getStates();
        setStates(ns);
    }


    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-2xl text-gray-900 text-center">
                Focus history
            </h1>
            <div className="flex justify-end">
                <Button
                    // width={20}
                    // className="p-0"
                    onClick={refreshState}>
                    <ArrowPathIcon
                        width={20}
                        height={20}
                    />
                </Button>
            </div>
            <LineChart
                width={600}
                height={300}
                data={states}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    domain={[0, 24]}
                    type="number"
                    dataKey="hour"
                />

                <YAxis dataKey="avg_score" />


                <Tooltip
                    formatter={(value, name, entry: any) => {
                        // console.log(entry)
                        return [
                            `Score: ${roundToTwo(entry.payload.avg_score) * 100}`
                        ];
                    }}
                />

                <Line
                    type="monotone"
                    dataKey="avg_score"
                    stroke="#8884d8"
                />

                <Legend
                    payload={[
                        { value: 'Focus', type: 'line', id: 'avg_score' }
                    ]}
                />

            </LineChart>
        </div>
    );
}
