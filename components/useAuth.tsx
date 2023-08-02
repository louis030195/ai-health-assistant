'use client'

import { Neurosity } from "@neurosity/sdk";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
const neurosity = new Neurosity();

export default function useOAuthResult(userId: string) {
    const paramsString = window.location.hash.replace("#", "");
    const params = new URLSearchParams(paramsString);
    const supabase = createClientComponentClient()
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | null>(null)

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

    useEffect(() => {
        const tk = params.get("access_token")
        // set params.get("access_token") in local storage
        if (tk) {
            setAccessToken(tk)
            getNeurosityUserId(tk).then((neurosityUserId) => {
                supabase.from('tokens').upsert({
                    user_id: neurosityUserId,
                    mediar_user_id: userId,
                    token: params.get("access_token")!
                },
                    {
                        onConflict: 'user_id',
                        ignoreDuplicates: true
                    }
                ).then(console.log)
            })
        } else {
            supabase.from('tokens').select().eq('mediar_user_id', userId).then(({ data, error: e }) => {
                if (data?.length) {
                    setAccessToken(data[0].token)
                }
                setError(e?.message || null)
            })
        }
    }, [params.get("access_token")])

    return {
        state: params.get("state"),
        error: error,
        customToken: params.get("access_token") || accessToken
    };
}