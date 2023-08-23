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


export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    return redirect('/signin');
  }

  // const hasOnboarded = await getOnboarding(session.user.id);
  // if (!hasOnboarded) {
  //   return redirect('/onboarding/intro');
  // }
  await saveOnboarding(session.user.id);
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
    <div className="flex flex-col  gap-10 items-center">
      <SaveTimezone userId={session?.user?.id} saveUserTimezoneServer={saveUserTimezoneServer} />
      <PosthogMail session={session!} />
      {
        // @ts-ignore
        userDetails?.neurosity?.disabled !== true &&
        <NeurosityStatus userId={session!.user.id} />
      }

      <TagBox session={session!}
        className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg justify-end"
      />

      {/* @ts-ignore */}
      {/* <iframe width="100%" height="400" src="https://www.youtube.com/embed/S0I5GDEoIkc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
      {/* @ts-ignore */}
      <iframe width="100%" height="560"
        src="https://www.youtube.com/embed/u4HlR_z49CA"
        title="YouTube video player"
        // frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      // allowfullscreen
      >

      </iframe>
      {/* <iframe width="100%" height="400" src="https://youtube.com/shorts/u4HlR_z49CA?feature=share" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}

      {/* mention that we removed charts and everything happens in whatsapp now! */}
      <p className="text-black text-lg font-bold text-center">The main Mediar interface is now in WhatsApp.
        Please <a
          className="text-blue-500 underline"
          href="/account">connect your WhatsApp number</a> to get started.</p>


      {/* {
        // @ts-ignore
        userDetails?.neurosity?.disabled !== true &&
        <NeurosityFocusChart session={session!} getStates={getStatesServer} getTags={getTagsServer} />
      }
      {
        // @ts-ignore
        userDetails?.oura?.disabled !== true &&
        <OuraSleepChart session={session!} getSleeps={getSleepServer} getTags={getTagsServer} />
      } */}
      {/* {
        // @ts-ignore
        userDetails?.oura?.disabled !== true &&
        <OuraHrvChart session={session!} />
      } */}
      {/* <CommandDialogDemo /> */}
      {/* <Chat /> */}
      {/* <NeurosityBrainwaveChart session={session!} getBrainwaves={getBrainwavesServer} getTags={getTagsServer} /> */}
    </div>
  );
}

