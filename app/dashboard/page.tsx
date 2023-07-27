import Pricing from '@/components/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices,
  getStates,
  getStatesWithFunction,
  getUserDetails
} from '@/app/supabase-server';


export default async function Dashboard() {
  const session = await getSession();

  const states = await (session?.user?.id ? getStatesWithFunction(session.user.id) : Promise.resolve([]))
  console.log(states)

  const getStatesServer = async (userId: string) => {
    'use server'
    return getStatesWithFunction(userId)
  }

  return (
    // center vertically and horizontally
    <div className="flex justify-center p-12 gap-4">
      <div className="flex flex-col space-y-4">
        <NeurosityForm session={session!} />

        <p className="mb-3 text-sm text-gray-500">
          This will record data about your brain in order to provide you insights
        </p>
      </div>
      {/* <NeurosityStatus neurosity={neurosity} /> */}+
      {/* center children */}
      <div className="flex flex-col mt-20 items-center">
        {/* <ChartTimePicker /> */}
        <NeurosityFocusChart session={session!} defaultStates={states} getStates={getStatesServer} />
      </div>
      {/* <FeelingsModal user={user} /> */}
    </div>
  );
}

import React from 'react'
import { NeurosityFocusChart } from './NeurosityFocusChart';
import { NeurosityStatus } from './NeurosityStatus';
import NeurosityForm from '../onboarding/neurosity/NeurosityForm';
import { Neurosity } from '@neurosity/sdk';
import FeelingsModal from './FeelingsModal';
import { ChartTimePicker } from './ChartTimePicker';

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