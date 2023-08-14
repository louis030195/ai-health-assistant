'use client'
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { GetStatesWithFunctionOptions } from '../supabase-server';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompletion } from 'ai/react'
import Markdown from '@/components/ui/Markdown';
import { Loader2 } from 'lucide-react';

interface Props {
    states: any[];
    tags: any[];
}

export const LLMInsights = ({ states, tags }: Props) => {
    const {
        completion,
        input,
        isLoading,
        handleSubmit,
        setInput
    } = useCompletion({
        api: '/api/completion',
    })

    useEffect(() => {
        setInput(`Human: Generate a list of insights about how the user's activities (tags) influence their health and cognitive performance, given these tags:

${JSON.stringify(tags)}

And these states (sleep, heart or focus scores) over time: 

${JSON.stringify(states)}

Here are a few rules:
- Your answers are very concise and straight to the point
- Your answers are based on the data provided
- Your answers are only the bullet points, and potentially some advices for the user at the end if you find any
- Do not say bullshit health advice, just infer from the data

Assistant:`)
    }, [states, tags])


    return (
        <form
            className="flex flex-col space-y-4 max-h-[300px] overflow-y-auto"
            onSubmit={handleSubmit}>
            <Button
                disabled={isLoading || !tags.length || !states.length}
                className="w-full"
                type='submit'
            >
                {
                    isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                }
                Get Insights</Button>
            <div className="max-w-[600px]">
                <Markdown>
                    {completion}
                </Markdown>
            </div>
        </form>
    );
}
