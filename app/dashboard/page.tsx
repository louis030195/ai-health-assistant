import {
  getSession,
  getStatesWithFunction,
  getProcessedBrainwaves,
  GetStatesWithFunctionOptions,
  GetProcessedBrainwavesOptions,
  getTags
} from '@/app/supabase-server';
import React from 'react'
import { NeurosityFocusChart } from './NeurosityFocusChart';
import { NeurosityBrainwaveChart } from './NeurosityBrainwaveChart';
import { PosthogMail } from './PosthogMail';
import TagBox from './TagBox';
import { redirect } from 'next/navigation';
import NeurosityStatus from './NeurosityStatus';


export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    return redirect('/signin');
  }
  
  const getStatesServer = async (userId: string, options?: GetStatesWithFunctionOptions) => {
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


  return (
    <div className="flex flex-col justify-center gap-2 items-center">
      <PosthogMail session={session!} />
      <NeurosityStatus userId={session!.user.id} />

      <TagBox session={session!}
        className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg justify-end"
      />
      <NeurosityFocusChart session={session!} getStates={getStatesServer} getTags={getTagsServer} />
      {/* <NeurosityBrainwaveChart session={session!} getBrainwaves={getBrainwavesServer} getTags={getTagsServer} /> */}
    </div>
  );
}

