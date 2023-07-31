import {
  getSession,
  getStatesWithFunction,
  getProcessedBrainwaves,
  GetStatesWithFunctionOptions,
  GetProcessedBrainwavesOptions,
  getTags
} from '@/app/supabase-server';
import React from 'react'
import { NeurosityFocusChart } from './NeurosityFocusChart';
import NeurosityForm from '../onboarding/neurosity/NeurosityForm';
import { NeurosityBrainwaveChart } from './NeurosityBrainwaveChart';
import { PosthogMail } from './PosthogMail';
import TagBox from './TagBox';
import Anthropic from '@anthropic-ai/sdk';
import { LLMInsights } from './LLMInsights';
import { redirect } from 'next/navigation';


export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    return redirect('/signin');
  }
  const states = await (session?.user?.id ? getStatesWithFunction(session.user.id) : Promise.resolve([]))
  const brainwaves = await (session?.user?.id ? getProcessedBrainwaves(session.user.id) : Promise.resolve([]))

  const getStatesServer = async (userId: string, options?: GetStatesWithFunctionOptions) => {
    'use server'
    return getStatesWithFunction(userId, options)
  }

  const getBrainwavesServer = async (userId: string, options?: GetProcessedBrainwavesOptions) => {
    'use server'
    return getProcessedBrainwaves(userId, options)
  }

  const getTagsServer = async (userId: string) => {
    'use server'
    return getTags(userId)
  }


  return (
    // scrollable
    <div className="flex flex-col justify-center gap-2 items-center">
      <PosthogMail session={session!} />
      <NeurosityForm session={session!} className="flex justify-center items-center" />

      <TagBox session={session!}
        className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg justify-end"
      />
      {/* <NeurosityStatus neurosity={neurosity} /> */}
      {/* center children */}
      {/* shadow */}
      {/* <div className="flex-row items-center gap-2 p-4 bg-white"> */}
      {/* <ChartTimePicker /> */}
      <NeurosityFocusChart session={session!} getStates={getStatesServer} getTags={getTagsServer} />
      {/* <NeurosityBrainwaveChart session={session!} defaultBrainwaves={brainwaves} getBrainwaves={getBrainwavesServer} /> */}
      {/* </div> */}
      {/* <FeelingsModal user={user} /> */}
    </div>
  );
}


const randomText = () => {
  let text = ''
  for (let i = 0; i < 10; i++) {
    text += String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  }
  return text
}


function Banner() {
  return (
    <div>
      <svg viewBox="0 0 600 600">

        {[...Array(10)].map((_, i) => (
          <text
            key={i}
            x="5"
            y={`${i * 20}`}
            fill="#7d9ddf"
            className="text-sm text-banner"
          >
            {randomText()}
          </text>
        ))}

      </svg>

    </div>
  )

}