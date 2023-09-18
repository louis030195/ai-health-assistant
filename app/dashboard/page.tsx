import {
  getSession,
  getStatesWithFunction,
  getProcessedBrainwaves,
  GetStatesWithFunctionOptions,
  GetProcessedBrainwavesOptions,
  getTags,
  getSleep,
  getOnboarding,
  getUserDetails,
  saveUserTimezone,
  saveOnboarding
} from '@/app/supabase-server';
import React from 'react'
import { NeurosityFocusChart } from './NeurosityFocusChart';
import { NeurosityBrainwaveChart } from './NeurosityBrainwaveChart';
import { PosthogMail } from './PosthogMail';
import TagBox from './TagBox';
import { redirect } from 'next/navigation';
import NeurosityStatus from './NeurosityStatus';
import { OuraSleepChart } from './OuraSleepChart';
import Chat from './Chat';
import { CommandDialogDemo } from './Command';
import { OuraHrvChart } from './OuraHrvChart';
import SaveTimezone from './SaveTimezone';
import { GoalInput } from './GoalInput';
import AppleHealthConnect from '@/components/AppleHealthConnect';
import MetriportConnect from '@/components/MetriportConnect';
import Link from 'next/link';
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    return redirect('/signin');
  }
  const hasOnboarded = await getOnboarding(session.user.id);
  if (!hasOnboarded) {
    return redirect('/onboarding/intro');
  } else {
    await saveOnboarding(session.user.id);
  }
  const userDetails = await getUserDetails();

  const saveUserTimezoneServer = async (userId: string, timezone: string) => {
    'use server'
    await saveUserTimezone(userId, timezone)
  }

  const getStatesServer = async (userId: string, options: GetStatesWithFunctionOptions) => {
    'use server'
    return getStatesWithFunction(userId, options)
  }

  const getBrainwavesServer = async (userId: string, options?: GetProcessedBrainwavesOptions) => {
    'use server'
    return getProcessedBrainwaves(userId, options)
  }

  const getTagsServer = async (userId: string) => {
    'use server'
    return getTags(userId)
  }

  const getSleepServer = async (userId: string) => {
    'use server'
    return getSleep(userId)
  }


  return (
    <div className="flex flex-col gap-10 items-center bg-gray-100 p-10">
      <SaveTimezone userId={session?.user?.id} saveUserTimezoneServer={saveUserTimezoneServer} />
      <PosthogMail session={session!} />

      <h2 className="text-2xl font-bold text-blue-700">Welcome to Mediar!</h2>
      <p className="text-lg text-gray-700">Follow these steps to get started:</p>
      <ol className="list-decimal list-inside text-gray-600">
        <li>Set your health goal</li>
        <li>Setup your communication preferences (WhatsApp or Telegram)</li>
        <li>Connect your health data sources (Apple Health, Google Fit, etc.)</li>
        <li>Send updates about what you eat, drink, do, and how you feel to get personalized insights</li>
      </ol>

      <Link
        href="/account"
        className="text-sm mt-2 underline text-blue-500"
      >Go to account to configure these...</Link>
    </div>
  );
}

