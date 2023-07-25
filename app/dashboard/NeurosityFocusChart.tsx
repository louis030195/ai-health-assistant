'use client'
import { PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';
import { Credentials } from '@neurosity/sdk/dist/esm/types/credentials';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNeurosity } from './useNeurosity';
import { neurosity } from '@/utils/neurosity-client';
import { Neurosity } from '@neurosity/sdk';


export const NeurosityFocusChart = () => {
    const [data, setData] = useState<any[]>([]);

    const [isLogged, setIsLogged] = useState(false);
    useEffect(() => {
        neurosity.onAuthStateChanged().subscribe((r) => {
            setIsLogged(r !== null)
        })
    }, [])

    useEffect(() => {
        // if (!isLogged) return;
        const neurosity = new Neurosity();

        neurosity.login({
            email: ".",
            password: "."
        }).then(() => {
            console.log('subscribing to focus')
            neurosity.focus().subscribe((focus) => {
                console.log('focus', focus)
                const nf = {
                    created_at: focus.timestamp?.toString(),
                    probability: focus.probability,
                    metadata: {
                        label: focus.label,
                    }
                }
                setData(prev => [...prev, nf]);
            })
        })
    }, [])
    console.log(data);
    const [numDataPoints, setNumDataPoints] = useState(50);
    const handleChange = (value: number) => {
        setNumDataPoints(value);
    }

    // Add a formatter for the timestamp on the X axis
    const xAxisFormatter = (timestamp: number) => {
        const date = new Date(timestamp);

        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${hours}:${minutes}`;
    }

    return (
        <>
            <input
                type="number"
                value={numDataPoints}
                onChange={(e) => handleChange(parseInt(e.target.value))}
            />
            <LineChart
                width={800}
                height={600}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    dataKey="created_at"
                    tickFormatter={xAxisFormatter}
                    // type="number"
                />

                <YAxis dataKey="probability" />

                <Tooltip
                    labelFormatter={value => `${value}%`}
                />

                <Line
                    type="monotone"
                    dataKey="probability"
                    stroke="#8884d8"
                />

                <Legend
                    payload={[
                        { value: 'Focus', type: 'line', id: 'probability' }
                    ]}
                />

            </LineChart>
        </>
    );
}
