import Pricing from '@/components/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import React from 'react'
import PricingPlan from './PricingPlan';


export default async function PricingPage() {
  // const [session, products, subscription] = await Promise.all([
  //   getSession(),
  //   getActiveProductsWithPrices(),
  //   getSubscription()
  // ]);

  // console.log('session', session)
  // console.log('products', products)
  // console.log('subscription', subscription)
  return (
    <PricingPlan />
    // <Pricing
    //   session={session}
    //   user={session?.user}
    //   products={products}
    //   subscription={subscription}
    // />
    // <Banner />
  );
}

