'use client'
import { PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';
import { Credentials } from '@neurosity/sdk/dist/esm/types/credentials';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNeurosity } from './useNeurosity';
import { SignalQuality } from '@neurosity/sdk/dist/esm/types/signalQuality';
import { Neurosity } from '@neurosity/sdk';


export const NeurosityStatus = ({ neurosity }: { neurosity: Neurosity }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [signalQuality, setSignalQuality] = useState<SignalQuality | undefined>(undefined);
    console.log('signalQuality', signalQuality)

    useEffect(() => {
        const { unsubscribe } = neurosity.focus().subscribe((r) => {
            console.log(r)
            setIsLogged(r !== null)
        })
        const { unsubscribe: u2 } = neurosity.signalQuality().subscribe((r) => setSignalQuality(r))
        setIsLogged(neurosity.bluetooth !== undefined)

        return () => {
            try {
                unsubscribe()
                u2()
            } catch { }
        }
    }, [])
    return (
        // display nice green light w tooltip if logged else red
        <div className="flex flex-row space-x-2">
            <div className={`w-4 h-4 rounded-full ${isLogged ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="text-sm text-gray-500">{isLogged ? 'Connected' : 'Not Connected'}</div>
            {/* display signal strength */}
            <div className="text-sm text-gray-500">{signalQuality?.toString()}</div>
        </div>
    );
}
