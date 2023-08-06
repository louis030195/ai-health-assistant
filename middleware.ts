import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types_db'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // ugly hack due to https://github.com/orgs/supabase/discussions/16135#discussioncomment-6642592
  if (session) {
    res.cookies.set('supabase.auth.token', session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    res.cookies.set('supabase.auth.refresh_token', session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.
        env.NODE_ENV === 'production',
    })
  } else if (req.cookies.get('supabase.auth.token')) {
    await supabase.auth.refreshSession({
      refresh_token: req.cookies.get('supabase.auth.refresh_token')!.value,
    })
  }

  return res
}