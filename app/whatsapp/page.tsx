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
            One health assistant for all your wearables in WhatsApp
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Send pictures or texts of events in your life to Mediar AI in WhatsApp and get health insights daily.
          </p>
          <div className="inline-flex gap-4">
            <div className="inline-flex rounded-md shadow">
              <a href="/signin" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-gray-100 hover:bg-gray-50">
                Get started - free
              </a>
            </div>
          </div>
          <iframe src="https://link.excalidraw.com/readonly/rHPoj3wOc81J954RiV6x" width="100%" height="800px"></iframe>
        </div>

      </div>
    </div>
  )

}




