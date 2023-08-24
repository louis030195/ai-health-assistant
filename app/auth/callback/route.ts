import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types_db'
import { getURL } from '@/utils/helpers'



export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('yo', requestUrl.origin)
  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const response = await supabase.auth.exchangeCodeForSession(code)
    const { data, error } = await supabase
      .from('onboardings')
      .select('*')
      .eq('user_id', response.data.user?.id)
      .limit(1)
    if (error) {
      console.error(error.message);
    }

    console.log('data', data)
    if (!data || data?.length === 0) return NextResponse.redirect(`${getURL()}/onboarding/intro`)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${getURL()}/dashboard`)
}