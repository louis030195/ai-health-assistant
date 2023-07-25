import Pricing from '@/components/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';

export default async function Dashboard() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    // center vertically
    <div className="flex justify-center">
      <h1
        className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
      >coming soon</h1>
      {/* <NeurosityForm session={session!} /> */}
      {/* <NeurosityStatus /> */}
      {/* <NeurosityFocusChart /> */}
    </div>
  );
}

import React from 'react'
import { NeurosityFocusChart } from './NeurosityFocusChart';
import { NeurosityStatus } from './NeurosityStatus';
import NeurosityForm from '../onboarding/neurosity/NeurosityForm';

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