'use client'
import { Button } from '@/components/ui/button';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DailyUsage({ kvGet, userId, limit, price }: { kvGet: any, userId: string, limit: number, price: any }) {

    const [stats, setStats] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            // local date
            const date = new Date().toLocaleDateString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });

            const questionKey = 'question_' + userId + '_' + date;
            const tagKey = 'tag_' + userId + '_' + date;

            // console.log('questionKey,tagKey:', questionKey, tagKey);
            const questionCount = await kvGet(questionKey) || 0;
            const tagCount = await kvGet(tagKey) || 0;
            console.log('questions,tags:', questionCount, tagCount);
            setStats([
                { name: 'Questions', value: questionCount },
                { name: 'Tags', value: tagCount }
            ]);
        };

        fetchData().finally(() => setIsLoading(false));
    }, [userId]);

    const onBiohacker = async () => {

        // const { sessionId } = await postData({
        //     url: '/api/create-checkout-session',
        //     data: { price: price },
        // });

        // const stripe = await getStripe();
        // stripe?.redirectToCheckout({ sessionId });
        const url = 'https://buy.stripe.com/28oeVDdGu4RA2JOfZ2'
        router.push(url);
    }

    const onAthlete = async () => {
        // https://cal.com/louis030195/athlete
        // const url = 'https://cal.com/louis030195/athlete';
        const url = 'https://buy.stripe.com/28oeVDdGu4RA2JOfZ2'
        router.push(url);
    }

    return (
        // border
        <div
            // min size
            className="p-4 flex gap-4 flex-col items-center justify-center border-1 border-gray-200 rounded-md min-w-[300px] min-h-[200px] shadow-md">
            <div className="text-2xl font-bold text-black">
                Daily Usage
            </div>

            <div className="grid grid-cols-2 gap-4 min-h-[100px]">
                {
                    isLoading && <Loader2
                        className="mr-2 h-10 w-10 animate-spin text-gray-500 col-span-2" />
                }
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
                limit === 2 ?
                    <Button
                        className="w-full"
                        onClick={onBiohacker}>Upgrade</Button>
                    : <Button
                        className="w-full"
                        onClick={onAthlete}>Upgrade</Button>
            }
        </div>
    );
}