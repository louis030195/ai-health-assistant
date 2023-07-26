import { Database } from '@/types_db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getSubscription() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getStates = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('states')
    .select('*')
    // .order('metadata->index')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

interface GetStatesWithFunctionOptions {
  bucketSize?: number;
  timezone?: string;
  day: Date;
}
export const getStatesWithFunction = async (options?: GetStatesWithFunctionOptions) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .rpc('get_states', {
      bucket_size: options?.bucketSize || 300,
      timezone: options?.timezone || 'America/Los_Angeles',
      // @ts-ignore
      day: options?.day || new Date(),
    })
  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getOnboarding = async (userId: string) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('onboardings')
    .select('*')
    .eq('user_id', userId)
    .limit(1)

  if (error) {
    console.log(error.message);
  }
  return data !== null && data.length > 0;
};

export const saveOnboarding = async (userId: string) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('onboardings')
    .upsert({
      updated_at: new Date().toString(),
      user_id: userId,
    })
    .eq('user_id', userId)

  if (error) {
    console.log(error.message);
  }
  return { error }
};

