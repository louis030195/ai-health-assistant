import {
  getSession,
  getStatesWithFunction,
  getProcessedBrainwaves,
  GetStatesWithFunctionOptions,
  GetProcessedBrainwavesOptions,
  getTags,
  getSleep
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


export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    return redirect('/signin');
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

  const hasSleep = (await getSleep(session.user.id)).length > 0

  return (
    <div className="flex flex-col justify-center gap-2 items-center">
      <PosthogMail session={session!} />
      <NeurosityStatus userId={session!.user.id} />

      <TagBox session={session!}
        className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg justify-end"
      />
      <NeurosityFocusChart session={session!} getStates={getStatesServer} getTags={getTagsServer} />
      {
        hasSleep &&
        <OuraSleepChart session={session!} getSleeps={getSleepServer} getTags={getTagsServer} />
      }
      {/* <CommandDialogDemo /> */}
      {/* <Chat /> */}
      {/* <NeurosityBrainwaveChart session={session!} getBrainwaves={getBrainwavesServer} getTags={getTagsServer} /> */}
    </div>
  );
}

