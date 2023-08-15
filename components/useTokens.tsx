'use client'

import { Neurosity } from "@neurosity/sdk";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
export function useNeurosityToken(userId: string) {
    const neurosity = new Neurosity()

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
        // supabase
        //     .channel('postgresChangesChannel')
        //     .on('postgres_changes', {
        //         event: '*',
        //         schema: 'public',
        //         table: 'tokens',
        //     },
        //         (payload) => {
        //    
        const tk = params.get("access_token")
        if (tk) {
            setAccessToken(tk)
            getNeurosityUserId(tk).then(async (neurosityUserId) => {
                await supabase.from('tokens').delete().match({ user_id: neurosityUserId, provider: 'neurosity' })
                supabase.from('tokens').upsert({
                    user_id: neurosityUserId,
                    mediar_user_id: userId,
                    token: tk,
                    provider: 'neurosity'
                }).then(console.log)
            })
        } else {
            supabase.from('tokens').select()
                .eq('mediar_user_id', userId)
                .eq('provider', 'neurosity')
                .then(({ data, error: e }) => {
                    if (data?.length) {
                        setAccessToken(data[0].token)
                    }
                    setError(e?.message || null)
                })
        }
    }, [params.get("access_token")])

    return {
        error: error,
        customToken: accessToken
    };
}

export function useOuraToken(userId: string) {
    const supabase = createClientComponentClient()
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<boolean | null>(null)


    useEffect(() => {
        supabase.from('tokens').select()
            .eq('mediar_user_id', userId)
            .eq('provider', 'oura')
            .then(({ data, error: e }) => {
                if (data?.length) {
                    setAccessToken(data[0].token)
                    try {
                        setStatus(JSON.parse(data[0].status).valid)
                    } catch (e) { }
                }
                setError(e?.message || null)
            })
    }, [])

    return {
        error: error,
        accessToken: accessToken,
        setAccessToken: setAccessToken,
        status: status,
    };
}