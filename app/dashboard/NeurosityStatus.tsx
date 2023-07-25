'use client'
import { PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';
import { Credentials } from '@neurosity/sdk/dist/esm/types/credentials';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNeurosity } from './useNeurosity';
import { neurosity } from '@/utils/neurosity-client';


export const NeurosityStatus = () => {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        neurosity.onAuthStateChanged().subscribe((r) => {
            console.log(r)
            setIsLogged(r !== null)
        })
    }, [])
    return (
        // display nice green light w tooltip if logged else red
        <div className="flex flex-row space-x-2">
            <div className={`w-4 h-4 rounded-full ${isLogged ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="text-sm">{isLogged ? 'Connected' : 'Not Connected'}</div>
        </div>
    );
}
