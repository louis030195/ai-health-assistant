import NeurosityConnect from '@/components/NeurosityConnect';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getUserDetails,
  getSubscription,
  setSession
} from '@/app/supabase-server';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import OuraConnect from '@/components/OuraConnect';
import { getOuraAccessToken, getOuraPersonalInfo } from '../oura-server';

export default async function Account() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  const user = session?.user;

  session && await setSession(session?.access_token, session?.refresh_token);

  if (!session) {
    return redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user?.id);
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const getOuraAccessTokenServer = async (code: string, scopes: string[]) => {
    'use server';
    const { accessToken, refreshToken } = await getOuraAccessToken(code);
    const personalInfo = await getOuraPersonalInfo(accessToken);
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    console.log('deleting oura token');
    // clear existing token
    const { error: e1 } = await supabase
      .from('tokens')
      .delete()
      .eq('mediar_user_id', user?.id)
      .eq('provider', 'oura');
    if (e1) {
      console.log(e1);
    }
    console.log('inserting oura token');
    const { error } = await supabase
      .from('tokens')
      .insert({
        user_id: personalInfo.id,
        metadata: personalInfo,
        scopes,
        mediar_user_id: user?.id, token: accessToken, refresh_token: refreshToken, provider: 'oura'
      });
    if (error) {
      console.log(error);
    }
    return accessToken;
  }

  return (
    <section className="mb-32 bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            Account
          </h1>
          {/* <p className="max-w-2xl m-auto mt-5 text-xl text-gray-600 sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p> */}
        </div>
      </div>
      {/* center */}
      <div className="p-4 flex gap-4 flex-col items-center justify-center">
        <NeurosityConnect session={session} className='w-2/5' onboarding={false} />
        {/* <OuraConnect session={session} onboarding={false} className='w-2/5' getOuraAccessToken={getOuraAccessTokenServer} /> */}
        {/* <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : 'You are not currently subscribed to any plan.'
          }
          footer={<ManageSubscriptionButton session={session} />}
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">Choose your plan</Link>
            )}
          </div>
        </Card> */}
        {/* <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">64 characters maximum</p>
              <Button
                variant="slim"
                type="submit"
                form="nameForm"
                disabled={true}
              >
                Update Name
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm" action={updateName}>
              <input
                type="text"
                name="name"
                className="w-1/2 p-3 rounded-md bg-gray-100" 
                defaultValue={userDetails?.full_name ?? ''}
                placeholder="Your name"
                maxLength={64}
              />
            </form>
          </div>
        </Card> */}
        {/* <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                We will email you to verify the change.
              </p>
              <Button
                variant="slim"
                type="submit"
                form="emailForm"
                disabled={true}
              >
                Update Email
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <Input
                type="text"
                name="email"
                className="w-1/2 p-3 rounded-md bg-gray-100"
                defaultValue={user ? user.email : ''}
                placeholder="Your email"
                maxLength={64}
              />
            </form>
          </div>
        </Card> */}
      </div>
    </section>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-gray-200">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-gray-500">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-gray-200 bg-gray-50 text-gray-700">
        {footer}
      </div>
    </div>
  );
}