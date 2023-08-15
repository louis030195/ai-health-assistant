import Pricing from '@/components/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices,
  getUserDetails
} from '@/app/supabase-server';
import React from 'react'
import PricingPlan from './PricingPlan';


export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([getSession(), getActiveProductsWithPrices(), getSubscription()]);
  return (
    <PricingPlan session={session} products={products} subscription={subscription} user={session?.user} />
  );
}

