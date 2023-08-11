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
            Insights about your brain activity.
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Combine brain activity data from sensors with wearable tech for AI-driven insights, enhancing focus, reducing anxiety, and promoting optimal health.
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




interface Props { }

const CatalystCard: React.FC<Props> = () => {
  return (
    <div className="cards isolate">
      <div id="catalyst">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="mt-2 text-title">
            Early access
          </h2>
        </div>
        <div className="mt-6 max-w-md text-2xl leading-tight sm:mx-auto text-muted sm:text-center">
          <p>Get beta versions of Mediar and 20% discount on future paid plans.</p>
        </div>
      </div>

      <div className="sm:max-w-sm mx-auto card card-shimmer card-grow bg-secondary rounded-lg sm:rounded-xl p-6 sm:p-8">
        <h3 id="tier-Hacker" className="text-xl font-semibold leading-7">Hacker</h3>
        <p className="mt-6 flex items-center gap-x-1 justify-center">
          <span className="text-4xl md:text-5xl font-semibold tracking-tight">$50+</span>
          <span className="text-gray-500">USD<span></span></span>
        </p>
        <p className="mt-3 text-muted">One-time payment</p>
        <a href="https://buy.stripe.com/4gw7tb31Q6ZIckoaEE" aria-describedby="tier-Hacker" className="mt-8 block w-full px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500">
          Support Mediar
        </a>
        <ul role="list" className="mt-8 mb-2 space-y-2 text-muted items-center">
          {['Support development', 'Early access to beta versions', '20% discount on future paid plans', 'Founder phone number'].map((item, index) => (
            <li key={index} className="flex gap-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check text-green-500 icon">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

