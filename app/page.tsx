import Pricing from '@/components/Pricing';

import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ArrowPathIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';

export default async function Home() {



  return (
    <div className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">

        <div className="text-center space-y-4">
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            One health assistant for all your wearables
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Combine your brain activity data from Neurosity and/or biometric data from wearables like Oura ring for AI-driven insights, enhancing focus, reducing anxiety, and promoting optimal health.
          </p>
          <div className="inline-flex gap-4">
            <div className="inline-flex rounded-md shadow">
              <a href="/signin" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-gray-100 hover:bg-gray-50">
                Get started - free
              </a>
            </div>
            {/*<div className="relative inline-flex rounded-md shadow">
              <a href="https://buy.stripe.com/4gw7tb31Q6ZIckoaEE" className="flex-col items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-100 bg-indigo-600 hover:bg-indigo-500">
                Support Mediar
              </a>
              <div className="absolute top-0 right-0 mt-1 mr-1">
                <HoverCard>
                  <HoverCardTrigger>
                    <QuestionMarkCircleIcon width={20} className="text-gray-100 hover:cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-300 h-150">
                    <CatalystCard />
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>*/}
          </div>
          <iframe src="https://link.excalidraw.com/p/readonly/HPHqJw8yfgFU0lEHDblD" width="100%" height="800px"></iframe>

          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
            How does it work?
          </p>
          <iframe width="100%" height="560"
            src="https://www.youtube.com/embed/u4HlR_z49CA"
            title="YouTube video player"
            // frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          // allowfullscreen
          />
          {/* <iframe src="https://link.excalidraw.com/p/readonly/x2iA4KZYDy8hdse5ltLu" width="100%" height="800px"></iframe> */}
        </div>

      </div>
    </div>
  )

}




