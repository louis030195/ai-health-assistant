import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types_db'
import { Neurosity } from '@neurosity/sdk'
const neurosity = new Neurosity();

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const token = requestUrl.searchParams.get('access_token')

    const waitForUser = async () => {
        return new Promise<string>((resolve, reject) => {
            const u = neurosity.onAuthStateChanged().subscribe((user) => {
                if (user) {
                    u.unsubscribe()
                    resolve(user.uid)
                }
            })
        })
    }

    const getNeurosityUserId = async (tk: string) => {
        const userPromise = waitForUser()
        await neurosity.login({ customToken: tk })
        return userPromise
    }

    if (token) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        const {
            data: { user }
        } = await supabase.auth.getUser();

        const neurosityUserId = await getNeurosityUserId(token)
        await supabase.from('tokens').delete().match({ user_id: neurosityUserId, provider: 'neurosity' })
        await supabase.from('tokens').upsert({
            user_id: neurosityUserId,
            mediar_user_id: user!.id,
            token: token,
            provider: 'neurosity'
        })
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin)
}