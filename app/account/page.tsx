import NeurosityConnect from '@/components/NeurosityConnect';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getUserDetails,
  getSubscription,
  getActiveProductsWithPrices,
} from '@/app/supabase-server';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import OuraConnect from '@/components/OuraConnect';
import { createOuraWebhookSubscription, deleteOuraWebhookSubscriptionOfType, getOuraAccessToken, getOuraAccessTokenServer, getOuraPersonalInfo, listOuraWebhookSubscriptions } from '../oura-server';
import WhatsappConnect from '@/components/ui/WhatsappConnect';
import OuraImport from '@/components/ui/OuraImport';
import PlanRibbon from '@/components/ui/PlanRibbon';
import { checkWhatsAppVerification, startWhatsAppVerification } from '../whatsapp-server';

export default async function Account() {
  const session = await getSession();

  if (!session) {
    return redirect('/signin');
  }
  const [subscription, products, userDetails] = await Promise.all([
    getSubscription(),
    getActiveProductsWithPrices(),
    getUserDetails()
  ]);
  const getOuraAccessTokenServerServer = async (code: string, scopes: string[], redirectUri: string) => {
    'use server'
    return getOuraAccessTokenServer(code, scopes, redirectUri)
  }
  const startVerificationServer = async (to: string) => {
    'use server'
    return startWhatsAppVerification(to)
  }
  const checkVerificationServer = async (to: string, code: string) => {
    'use server'
    return checkWhatsAppVerification(to, code)
  }
  return (
    <section className="mb-32 bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            Account
          </h1>
        </div>
      </div>
      {/* center */}
      <div className="p-4 flex gap-4 flex-col items-center justify-center">
        {/* <PlanRibbon
          displayText="Biohacker Plan"
          price={products?.find((product) => product.name === 'Biohacker')?.prices[0]!}
          subscription={subscription || undefined}
          session={session}
        > */}
        <WhatsappConnect session={session} subscription={subscription || undefined} userDetails={userDetails || undefined}
          startVerification={startVerificationServer} verifyOtp={checkVerificationServer} />

        {/* </PlanRibbon> */}
        <NeurosityConnect session={session} className='w-2/5' onboarding={false} />
        <OuraConnect session={session} onboarding={false} className='w-2/5' getOuraAccessToken={getOuraAccessTokenServerServer} />
        <OuraImport session={session} />
      </div>
    </section >
  );
}

