
import { Neurosity } from '@neurosity/sdk';
import { useState, useEffect } from 'react';
import { BrainwavesLabel, PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';
import { Credentials } from '@neurosity/sdk/dist/esm/types/credentials';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';

export function useNeurosity(neurosity: Neurosity) {
    const [data, setData] = useState<any[]>([]);
    const supabase = createClientComponentClient<Database>()

    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        neurosity.onAuthStateChanged().subscribe((r) => {
            setIsLogged(r !== null)
        })
    }, [])

    useEffect(() => {
        if (!isLogged) return
        console.log("listening to focus now");
        const { unsubscribe } = neurosity.focus().subscribe((focus) => {
            console.log("focus", focus);
            const nf = {
                created_at: focus.timestamp?.toString(),
                probability: focus.probability,
                metadata: {
                    label: focus.label,
                }
            }
            setData(prev => [...prev, nf]);
            // const { error } = await supabase.from('states').insert(nf)
            // if (error) {
            //     console.log("error", error);
            //     unsubscribe();
            //     console.log("unsubscribed");
            // }
        });

        // return () => unsubscribe();
    }, [isLogged]);

    // useEffect(() => {
    //     const channelB = supabase
    //         .channel('table-db-changes')
    //         .on(
    //             'postgres_changes',
    //             {
    //                 event: 'INSERT',
    //                 schema: 'public',
    //                 table: 'waves',
    //             },
    //             (payload) => setData((prev) => [...prev, payload.new])
    //         )
    //         .subscribe()
    //     return () => {
    //         channelB.unsubscribe().then(console.log)
    //     }
    // }, [neurosity]);

    return data;
}



function listenToBrain(neurosity: Neurosity, callback: (brainwaves: PowerByBand) => Promise<void>) {
    const { unsubscribe } = neurosity.brainwaves("powerByBand").subscribe((brainwaves) => {
        callback(brainwaves as PowerByBand);
    });

    return unsubscribe
}