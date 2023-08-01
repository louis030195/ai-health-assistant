'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function useOAuthResult(userId: string) {
    const paramsString = window.location.hash.replace("#", "");
    const params = new URLSearchParams(paramsString);
    const supabase = createClientComponentClient()
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // set params.get("access_token") in local storage
        if (params.get("access_token")) {
            setAccessToken(params.get("access_token")!)
            supabase.from('tokens').upsert({ user_id: userId, token: params.get("access_token")! },
                {
                    onConflict: 'user_id',
                    ignoreDuplicates: true
                }
            ).then(console.log)
        } else {
            supabase.from('tokens').select().eq('user_id', userId).then(({ data, error: e }) => {
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