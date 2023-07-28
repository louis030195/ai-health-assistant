import Pricing from '@/components/Pricing';

import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';

export default async function Home() {

  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <div className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">

        <div className="text-center space-y-4">
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Optimize your brain health with <a href="https://neurosity.co"
              className="text-indigo-700 hover:text-indigo-600 underline"
              target="_blank">Neurosity</a>
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Track your brain health, tag, get insights, get better, weekly.
          </p>
          <div className="inline-flex rounded-md shadow">
            <a href="/signin" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-gray-100 hover:bg-gray-50">
              Get started - free
            </a>
          </div>
          <iframe src="https://link.excalidraw.com/p/readonly/HPHqJw8yfgFU0lEHDblD" width="100%" height="800px"></iframe>
        </div>

      </div>
    </div>
  )

}


import React from 'react'
import RootLayout from './layout';

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

