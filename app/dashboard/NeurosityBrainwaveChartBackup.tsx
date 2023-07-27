'use client'
import { PowerByBand } from '@neurosity/sdk/dist/esm/types/brainwaves';
import { Credentials } from '@neurosity/sdk/dist/esm/types/credentials';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { neurosity } from '@/utils/neurosity-client';


export const NeurosityBrainwaveChart = () => {
    return (<></>)
    // const [numDataPoints, setNumDataPoints] = useState(50);
    // const handleChange = (value: number) => {
    //     setNumDataPoints(value);
    // }

    // // Add a formatter for the timestamp on the X axis
    // const xAxisFormatter = (timestamp: number) => {
    //     const date = new Date(timestamp);

    //     const hours = date.getHours();
    //     const minutes = date.getMinutes();

    //     return `${hours}:${minutes}`;
    // }

    // // Use distinct colors for each line
    // const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d00000', '#804000', '#00ff00'];
    // // Get the last timestamp from the sliced data
    // const lastTimestamp = data[data.length - numDataPoints]?.timestamp;
    // const slicedData = data.slice(-numDataPoints);


    // return (
    //     <>
    //         <input
    //             type="number"
    //             value={numDataPoints}
    //             onChange={(e) => handleChange(parseInt(e.target.value))}
    //         />
    //         {
    //             !lastTimestamp ?
    //                 <div role="status" className="max-w-sm animate-pulse">
    //                     <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    //                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    //                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    //                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    //                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    //                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
    //                     <span className="sr-only">Loading...</span>
    //                 </div>
    //                 :
    //                 <LineChart
    //                     width={800}
    //                     height={600}
    //                     data={slicedData}
    //                     margin={{
    //                         top: 5,
    //                         right: 30,
    //                         left: 20,
    //                         bottom: 5
    //                     }}
    //                 >
    //                     <CartesianGrid strokeDasharray="3 3" />
    //                     <XAxis
    //                         type="number"
    //                         dataKey="timestamp"
    //                         tickFormatter={xAxisFormatter}
    //                         domain={[lastTimestamp, 'auto']}
    //                     />
    //                     <YAxis />
    //                     <Tooltip />
    //                     <Legend />

    //                     {new Array(8).fill(0).map((value, index) => (
    //                         <Line
    //                             key={index}
    //                             type="monotone"
    //                             dataKey={`data.gamma.${index}`}
    //                             data={slicedData}
    //                             stroke={colors[index]}
    //                         />
    //                     ))}


    //                 </LineChart>
    //         }
    //     </>
    // );
}
