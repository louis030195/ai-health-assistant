import NeurosityConnect from '@/components/NeurosityConnect';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getUserDetails,
  getSubscription,
  getActiveProductsWithPrices,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import OuraConnect from '@/components/OuraConnect';
import { createOuraWebhookSubscription, deleteOuraWebhookSubscriptionOfType, getOuraAccessToken, getOuraAccessTokenServer, getOuraPersonalInfo, listOuraWebhookSubscriptions, revokeOuraAccessToken } from '../oura-server';
import WhatsappConnect from '@/components/ui/WhatsappConnect';
import OuraImport from '@/components/ui/OuraImport';
import PlanRibbon from '@/components/ui/PlanRibbon';
import { checkWhatsAppVerification, startWhatsAppVerification } from '../whatsapp-server';
import OuraDisconnect from '@/components/OuraDisconnect';
import NeurosityDisconnect from '@/components/NeurosityDisconnect';
import DailyUsage from './DailyUsage';
import { kv } from '@vercel/kv';
import TelegramConnect from '@/components/ui/TelegramConnect';
import { checkTelegramVerification, sendTelegramMessage, startTelegramVerification } from '../telegram-server';
import Sub from './Sub';
export const dynamic = "force-dynamic";

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
  const revokeOuraAccessTokenServer = async (accessToken: string) => {
    'use server'
    return revokeOuraAccessToken(accessToken)
  }
  const kvGetServer = async (key: string) => {
    'use server'
    const v = await kv.get(key)
    return v
  }

  const sendTelegramMessageServer = async (to: string, text: string) => {
    'use server'
    return sendTelegramMessage(to, text)
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
        <DailyUsage userId={session.user.id} kvGet={kvGetServer} limit={
          subscription?.prices?.products?.name === 'Biohacker' ? 10 : 2
        }
          price={products.find((product) => product.name === 'Biohacker')?.prices[0]!}
        />
        <Sub session={session} subscription={subscription || undefined} displayText="Biohacker Plan" />
        <PlanRibbon
          displayText="Beta"
          price={products?.find((product) => product.name === 'Biohacker')?.prices[0]!}
          subscription={subscription || undefined}
          session={session}
        >
          <WhatsappConnect session={session} subscription={subscription || undefined} userDetails={userDetails || undefined}
            startVerification={startVerificationServer} verifyOtp={checkVerificationServer} />
        </PlanRibbon>

        <TelegramConnect session={session} subscription={subscription || undefined} userDetails={userDetails || undefined}
          sendTelegramMessage={sendTelegramMessageServer} />

        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md">
          <NeurosityConnect session={session}
            className='w-4/5 shadow-none'
            onboarding={false} />
          <NeurosityDisconnect session={session} />
        </div>
        {/* shadow */}
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md">
          <OuraConnect session={session} onboarding={false}
            // remove shadow
            className='w-4/5 shadow-none'
            getOuraAccessToken={getOuraAccessTokenServerServer} />
          <OuraImport session={session} />
          <OuraDisconnect session={session} revokeOuraAccessToken={revokeOuraAccessTokenServer} />
        </div>
      </div>
    </section >
  );
}

