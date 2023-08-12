import Pricing from '@/components/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import React from 'react'
import PricingPlan from './PricingPlan';


export default async function PricingPage() {
  const session = await getSession()

  return (
    <PricingPlan session={session} />
  );
}

