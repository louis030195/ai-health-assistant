import NeurosityConnect from '@/components/NeurosityConnect';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getUserDetails,
  getSubscription,
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

export default async function Account() {
  const session = await getSession();

  if (!session) {
    return redirect('/signin');
  }

  const getOuraAccessTokenServerServer = async (code: string, scopes: string[], redirectUri: string) => {
    'use server'
    return getOuraAccessTokenServer(code, scopes, redirectUri)
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
        <NeurosityConnect session={session} className='w-2/5' onboarding={false} />
        <OuraConnect session={session} onboarding={false} className='w-2/5' getOuraAccessToken={getOuraAccessTokenServerServer} />
        <OuraImport session={session} />
        {/* <WhatsappConnect /> */}
      </div>
    </section>
  );
}

