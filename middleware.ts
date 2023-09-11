import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types_db'
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
}
const apiRoutes = [
  '/api/whatsapp',
  '/api/insights',
  '/api/telegram',
]

export async function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS,
    })
  }
  const res = NextResponse.next()

  if (
    apiRoutes.some((route) => req.nextUrl.pathname.includes(route))
  ) {
    return res
  }
  const supabase = createMiddlewareClient<Database>({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    /** Conditional import required for use with Next middleware to avoid a webpack error 
         * https://nextjs.org/docs/pages/building-your-application/routing/middleware */
    try {
      const { registerHighlight } = await import('@highlight-run/next/server')

      registerHighlight({
        projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID!,
      })
      console.log('Highlight instrumentation registered')
    } catch (error) {
      console.error(error)
    }
  }

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