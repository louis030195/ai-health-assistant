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
import { GoalInput } from '../dashboard/GoalInput';
import MetriportConnect from '@/components/MetriportConnect';
import LanguageDropdown from './LanguageSelector';
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
      <div className="lg:w-4/5 sm:w-3/4 w-full flex flex-col items-center justify-center gap-4 mx-auto">
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md w-4/5">
          <h2 className="text-lg font-bold mb-2">Set Your Goal</h2>
          <p className="text-sm text-gray-600 mb-4">Your goal will influence the insights of the AI, the questions asked, and the prompts given to you. You can update your goal here at any time.</p>
          <div className="w-full sm:w-2/3 flex flex-col items-center justify-center gap-2">
            <GoalInput userDetails={userDetails} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md w-4/5">
          <h2 className="text-lg font-bold mb-2">Set Your Language</h2>
          <p className="text-sm text-gray-600 mb-4">This is change the language the AI uses to communicate with you.</p>
          <div className="w-full sm:w-2/3 flex flex-col items-center justify-center gap-2">
            <LanguageDropdown userId={session.user.id} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md w-4/5">
          <h2 className="text-lg font-bold mb-2">Connect your health data</h2>
          <p className="text-sm text-gray-600 mb-4">Connect your health/fitness accounts to get your health data.</p>
          <MetriportConnect userId={session.user.id} />
        </div>

        <WhatsappConnect session={session} subscription={subscription || undefined} userDetails={userDetails || undefined}
          startVerification={startVerificationServer} verifyOtp={checkVerificationServer} className='w-4/5' />

        <TelegramConnect session={session} subscription={subscription || undefined} userDetails={userDetails || undefined}
          sendTelegramMessage={sendTelegramMessageServer} className='w-4/5' />


      </div>
    </section >
  );
}

