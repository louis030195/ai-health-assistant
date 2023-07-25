
import { Neurosity } from '@neurosity/sdk';
import { useState, useEffect } from 'react';
import { BrainwavesLabel, PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';
import { Credentials } from '@neurosity/sdk/dist/esm/types/credentials';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';

class FakeNeurosity extends Neurosity {
    login(_: Credentials) {
        console.log("Fake login");
        return Promise.resolve();
    }

    // @ts-ignore
    brainwaves(_: BrainwavesLabel) {
        return {
            subscribe: (callback: (data: PowerByBand) => void) => {
                setInterval(() => {
                    const randomData = {
                        label: "fake",
                        timestamp: Date.now(),
                        alpha: randomArray(8),
                        beta: randomArray(8),
                        delta: randomArray(8),
                        gamma: randomArray(8),
                        theta: randomArray(8),
                    };

                    callback(randomData);
                }, 1000);

                return {
                    unsubscribe: () => { }
                }
            },
        };
    }
}

function randomArray(length: number) {
    return Array.from({ length }, () => Math.random());
}

export const neurosity = new Neurosity();
// export const neurosity = new FakeNeurosity();
