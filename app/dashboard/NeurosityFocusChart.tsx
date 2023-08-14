'use client'
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { GetStatesWithFunctionOptions } from '../supabase-server';
import { LLMInsights } from './LLMInsights';
import posthog from 'posthog-js';

interface Props {
    session: Session;
    getStates: (userId: string, options: GetStatesWithFunctionOptions) => Promise<any[]>;
    getTags: (userId: string) => Promise<any[]>;
}

export const NeurosityFocusChart = ({ session, getStates, getTags }: Props) => {
    let [states, setStates] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);

    // This line transforms each avg_score in states to be between 0 and 100
    states = states.map(state => {
        return {
            ...state,
            avg_score: (state.avg_score + 1) / 2 * 100, // Transformation added here
        };
    });

    console.log('states', states);

    const refreshState = async () => {
        if (!session?.user?.id) return

        const ns = await getStates(session.user.id, {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            // day: new Date(),
        });
        setStates(ns);
        const nt = await getTags(session.user.id);
        setTags(nt);

        posthog.capture('refresh-state');
    }

    useEffect(() => {
        refreshState();
    }, []);


    const dateFormat = (tag: any) => {
        if (!tag.created_at) return null
        const date = new Date(tag.created_at);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split('T')[0];
    }
    // Create the "Focus" data series
    const focusData = {
        x: states.map(state => state.start_ts),
        y: states.map(state => state.avg_score), // avg_score is now between 0 and 100
        type: 'scatter',
        mode: 'markers',
        marker: { color: '#8884d8' },
        name: 'Focus'
    };


    // If tags are not empty, create the "Tags" data series and annotations
    let tagsData: any = {};
    let annotations: any[] = [];
    if (tags.length > 0) {
        tagsData = {
            x: tags.map((tag) => {
                const date = new Date(tag.created_at);
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - offset * 60 * 1000);
                const parsedDate = localDate.toISOString()//.split('T')[0];

                if (isNaN(Date.parse(parsedDate))) {
                    // console.warn("Invalid tag date:", tag.created_at);
                    return null;
                }
                return parsedDate;
            }).filter(Boolean), // Removes null entries

            y: tags.map(() => 0), // Show the tags at the bottom of the plot
            mode: 'markers',
            marker: {
                // green
                color: '#48bb78',
                size: 5
            },
            hovertemplate: '%{text}<br>%{x}', // Show the tag text when hovering over the marker
            text: tags.map(tag => tag.text),
            name: 'Tags' // This name will appear in the legend
        };
        annotations = tags.map((tag, index) => {
            const date = tag.created_at ? dateFormat(tag.created_at) : null;
            if (!date) {
                // console.warn("Invalid tag date:", tag.created_at);
                return null;
            }
            return {
                x: tag.created_at ? dateFormat(tag.created_at) : null,
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
        }).filter(Boolean);
    }

    const data = [focusData];
    // Only add the "Tags" series if it exists
    if (Object.keys(tagsData).length > 0) {
        data.push(tagsData);
    }

    const layout = {
        title: 'Focus history',
        xaxis: {
            title: 'Time',
        },
        yaxis: {
            title: 'Score',
            range: [-1, 100] // Adjusted range from [-1, 1] to [0, 100]
        },
        annotations: annotations,
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
            <div className="flex flex-col space-y-4">
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
                <LLMInsights states={states} tags={tags} />
            </div>

        </div>
    );
}
