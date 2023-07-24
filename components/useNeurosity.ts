
// import { Neurosity } from '@neurosity/sdk';
// import { useState, useEffect } from 'react';
// import { BrainwavesLabel, PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';
// import { Credentials } from '@neurosity/sdk/dist/esm/types/credentials';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { Database } from '@/types/supabase';


// class FakeNeurosity extends Neurosity {
//     login(_: Credentials) {
//         console.log("Fake login");
//         return Promise.resolve();
//     }

//     // @ts-ignore
//     brainwaves(_: BrainwavesLabel) {
//         return {
//             subscribe: (callback: (data: PowerByBand) => void) => {
//                 setInterval(() => {
//                     const randomData = {
//                         label: "fake",
//                         timestamp: Date.now(),
//                         alpha: randomArray(8),
//                         beta: randomArray(8),
//                         delta: randomArray(8),
//                         gamma: randomArray(8),
//                         theta: randomArray(8),
//                     };

//                     callback(randomData);
//                 }, 1000);

//                 return {
//                     unsubscribe: () => { }
//                 }
//             },
//         };
//     }
// }

// function randomArray(length: number) {
//     return Array.from({ length }, () => Math.random());
// }

// // const neurosity = new Neurosity();
// const neurosity = new FakeNeurosity();

// export function useBrainwaveData(neurosity: Neurosity) {
//     const [data, setData] = useState<any[]>([]);
//     const supabase = createClientComponentClient<Database>()

//     useEffect(() => {
//         const unsubscribe = listenToBrain(async (brainwaves) => {
//             setData(prev => [...prev, brainwaves]);
//             const { error } = await supabase.from('waves').insert({
//                 alpha: brainwaves.alpha,
//                 beta: brainwaves.beta,
//                 delta: brainwaves.delta,
//                 gamma: brainwaves.gamma,
//                 theta: brainwaves.theta,
//                 // @ts-ignore
//                 timestamp: brainwaves.timestamp?.toString(),
//                 metadata: {
//                     // @ts-ignore
//                     label: brainwaves.label,
//                 }
//             })
//             if (error) {
//                 console.log("error", error);
//                 unsubscribe();
//                 console.log("unsubscribed");
//             }
//         });

//         return () => unsubscribe();
//     }, [neurosity]);

//     useEffect(() => {
//         const channelB = supabase
//             .channel('table-db-changes')
//             .on(
//                 'postgres_changes',
//                 {
//                     event: 'INSERT',
//                     schema: 'public',
//                     table: 'waves',
//                 },
//                 (payload) => setData((prev) => [...prev, payload.new])
//             )
//             .subscribe()
//         return () => {
//             channelB.unsubscribe().then(console.log)
//         }
//     }, [neurosity]);

//     return data;
// }



// function listenToBrain(email: string, password: string, callback: (brainwaves: PowerByBand) => Promise<void>) {
//     neurosity.login({
//         email: email,
//         password: password,
//     }).catch((error) => {
//         console.log("error", error);
//     });

//     const { unsubscribe } = neurosity.brainwaves("powerByBand").subscribe((brainwaves) => {
//         callback(brainwaves);
//     });

//     return unsubscribe
// }