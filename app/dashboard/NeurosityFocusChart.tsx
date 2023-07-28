'use client'
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { GetStatesWithFunctionOptions } from '../supabase-server';

interface Props {
    session: Session;
    defaultStates: any[];
    getStates: (userId: string, options: GetStatesWithFunctionOptions) => Promise<any[]>;
    getTags: (userId: string) => Promise<any[]>;
}

export const NeurosityFocusChart = ({ session, defaultStates, getStates, getTags }: Props) => {
    let [states, setStates] = useState<any[]>(defaultStates);
    const [tags, setTags] = useState<any[]>([]);

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
        const nt = await getTags(session.user.id);
        setTags(nt);
    }

    // Convert tags to annotations for the layout
    const annotations = tags.map((tag, index) => {
        return {
            x: tag.created_at,
            y: 0,
            xref: 'x',
            yref: 'paper',
            // text: tag.text,
            showarrow: false,
            arrowhead: 7,
            ax: 0,
            ay: -50,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderwidth: 2,
            borderpad: 4,
            hovertext: tag.text,
        };
    });

    const data = [
        {
            x: states.map(state => state.start_ts),
            y: states.map(state => state.avg_score),
            type: 'scatter',
            mode: 'lines',
            marker: { color: '#8884d8' },
            name: 'Focus'
        },
        {
            x: tags.map(tag => {
                const date = new Date(tag.created_at);
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - offset * 60 * 1000);
                return localDate.toISOString().split('T')[0];
            }),
            y: tags.map(() => 0), // Show the tags at the bottom of the plot
            mode: 'markers',
            marker: {
                // green
                color: '#48bb78',
                size: 5
            },
            hovertemplate: '%{text}', // Show the tag text when hovering over the marker
            text: tags.map(tag => tag.text),
            name: 'Tags' // This name will appear in the legend
        }
    ];

    const layout = {
        title: 'Focus history',
        xaxis: {
            title: 'Time',
        },
        yaxis: {
            title: 'Score',
            range: [-1, 1] // Adjust the y-axis to show the tags at the bottom
        },
        annotations: annotations, // Add the annotations to the layout
    };

    return (
        <div className="relative flex flex-col p-4 rounded-lg shadow-lg">
            <Button
                onClick={refreshState}
                variant="secondary"
                className="absolute top-0 left-50 mt-2 mr-2 z-10 bg-white"
            >
                <ArrowPathIcon
                    width={20}
                    height={20}
                />
            </Button>
            <Plot
                // @ts-ignore
                data={data}
                // @ts-ignore
                layout={layout}
                style={{
                    width:
                        // small on mobile
                        window.innerWidth < 640 ? "300px" :
                            "600px",
                    height:
                        window.innerWidth < 640 ? "200px" :
                            "300px"
                }}
            />
        </div>
    );
}
