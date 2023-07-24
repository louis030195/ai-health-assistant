import Pricing from '@/components/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';

export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <Pricing
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
    // <Banner />
  );
}

import React from 'react'

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