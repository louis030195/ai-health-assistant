'use client'
import { Button } from '@/components/ui/button';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useState, useEffect } from 'react';

export default function DailyUsage({ kvGet, userId, limit, price }: { kvGet: any, userId: string, limit: number, price: any }) {

    const [stats, setStats] = useState<any>([]);


    useEffect(() => {
        const fetchData = async () => {
            const date = new Date().toLocaleDateString('en-US');

            const questionKey = 'question_' + userId + '_' + date;
            const tagKey = 'tag_' + userId + '_' + date;

            const questionCount = await kvGet(questionKey) || 0;
            const tagCount = await kvGet(tagKey) || 0;
            console.log('questions,tags:', questionCount, tagCount);
            setStats([
                { name: 'Questions', value: questionCount },
                { name: 'Tags', value: tagCount }
            ]);
        };

        fetchData();
    }, [userId]);

    const onBiohacker = async () => {

        const { sessionId } = await postData({
            url: '/api/create-checkout-session',
            data: { price: price },
        });

        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
    }

    return (
        // border
        <div className="p-4 flex gap-4 flex-col items-center justify-center border-2 border-gray-200 rounded-md">
            <div className="text-2xl font-bold text-black">
                Daily Usage
            </div>

            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat: any) => (
                    <div key={stat.name} className="bg-white p-4">
                        <dt className="text-sm font-medium text-gray-500 text-center">
                            {stat.name}
                        </dt>

                        <dd className="text-3xl font-medium text-gray-900">
                            {stat.value} / {limit}
                        </dd>
                    </div>
                ))}
            </div>
            {
                limit === 2 &&
                <Button
                    className="w-full"
                    onClick={onBiohacker}>Upgrade</Button>
            }
        </div>
    );
}