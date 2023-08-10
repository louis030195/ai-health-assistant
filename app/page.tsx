import Pricing from '@/components/Pricing';

import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import React from 'react'

export default async function Home() {



  return (
    <div className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">

        <div className="text-center space-y-4">
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Insights about your brain activity.
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Combine brain activity data from sensors with wearable tech for AI-driven insights, enhancing focus, reducing anxiety, and promoting optimal health.
          </p>
          <div className="inline-flex rounded-md shadow">
            <a href="/signin" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-gray-100 hover:bg-gray-50">
              Get started - free
            </a>
          </div>
          <iframe src="https://link.excalidraw.com/p/readonly/HPHqJw8yfgFU0lEHDblD" width="100%" height="800px"></iframe>

          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
            How does it work?
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Mediar uses brain activity data from<a href="https://neurosity.co"
              className="text-indigo-700 hover:text-indigo-600 underline"
              target="_blank"> Neurosity Crown</a> to provide charts and insights about your brain activity.
          </p>
          <iframe src="https://link.excalidraw.com/p/readonly/x2iA4KZYDy8hdse5ltLu" width="100%" height="800px"></iframe>
        </div>

      </div>
    </div>
  )

}

