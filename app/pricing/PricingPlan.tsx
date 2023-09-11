'use client'
import { CheckIcon } from '@heroicons/react/20/solid'
import { getSession } from '../supabase-server'
import { Session, User } from '@supabase/supabase-js'
import { Database } from '@/types_db';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Loader2 } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ArrowPathIcon, CheckBadgeIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
    prices: Price[];
}
interface PriceWithProduct extends Price {
    products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
    prices: PriceWithProduct | null;
}
interface Props {
    session: Session | null;
    user: User | null | undefined;
    products: ProductWithPrices[];
    subscription: SubscriptionWithProduct | null;
}

export default function Example({ session, user, products, subscription }: Props) {
    console.log("subscription", subscription);

    const router = useRouter();
    const [biohackerLoading, setBiohackerLoading] = useState<boolean>(false);

    const onBiohacker = async () => {
        setBiohackerLoading(true);
        if (!user) {
            return router.push('/signin');
        }
        if (subscription) {
            return router.push('/account');
        }
        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price: products.find((product) => product.name === 'Biohacker')?.prices[0]! },
            });

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            return alert((error as Error)?.message);
        } finally {
            setBiohackerLoading(false);
        }
    }

    return (
        <div className="isolate overflow-hidden bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center sm:pt-32 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        The right price for you, <br className="hidden sm:inline lg:hidden" />
                        whoever you are
                    </p>
                </div>

                <div className="relative mt-6">
                    <p className="mx-auto max-w-2xl text-lg leading-8 text-white/60">
                        Achieve peak performance with Mediar, your personal AI coach based on your wearable data.
                    </p>

                    <svg
                        viewBox="0 0 1208 1024"
                        className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
                    >
                        <ellipse cx={604} cy={512} fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)" rx={604} ry={512} />
                        <defs>
                            <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                                <stop stopColor="#7775D6" />
                                <stop offset={1} stopColor="#E935C1" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
            </div>
            <div className="flow-root bg-white pb-24 sm:pb-32">
                <div className="-mt-80">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-6xl lg:grid-cols-3">

                            <div className="flex flex-col justify-between rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                                <div>
                                    <h3 id="tier-standard" className="text-base font-semibold leading-7 text-indigo-600">
                                        Standard
                                    </h3>
                                    <p className="text-base leading-7 text-gray-600">
                                        Pay-once license for you.
                                    </p>
                                    <div className="mt-2 border-t border-gray-200 pt-6" />
                                    <div className="flex items-baseline gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">$89</span>
                                    </div>
                                    <div className="mt-6 border-t border-gray-200 pt-6" />
                                    <p className="text-base leading-7 text-gray-600">
                                        Includes:
                                    </p>
                                    <ul role="list" className="mt-6 space-y-4 text-sm leading-6 text-gray-600">
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            1 member (share with your family, friends, coach, psychologist, doctor, etc.)
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Pay once, use forever
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            All Mediar features
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            1 year of updates
                                        </li>
                                    </ul>
                                </div>
                                <a
                                    href="https://buy.stripe.com/28oeVDdGu4RA2JOfZ2"
                                    aria-describedby="tier-standard"
                                    className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Choose Standard Plan
                                </a>
                            </div>

                            {/* Extended Plan */}
                            <div className="flex flex-col justify-between rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                                <div>
                                    <h3 id="tier-extended" className="text-base font-semibold leading-7 text-indigo-600">
                                        Extended
                                    </h3>
                                    <p className="text-base leading-7 text-gray-600">
                                        Great for accountability partners.
                                    </p>
                                    <div className="mt-2 border-t border-gray-200 pt-6" />
                                    <div className="flex items-baseline gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">$189</span>
                                    </div>
                                    <div className="mt-6 border-t border-gray-200 pt-6" />
                                    <p className="text-base leading-7 text-gray-600">
                                        Includes:
                                    </p>
                                    <ul role="list" className="mt-6 space-y-4 text-sm leading-6 text-gray-600">
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            3 members (share with your family, friends, coach, psychologist, doctor, etc.)
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Discord bot (social health tracking)
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Pay once, use forever
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            All Mediar features
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            1 year of updates
                                        </li>
                                    </ul>
                                </div>
                                <a
                                    href="https://buy.stripe.com/14k9BjfOC5VEgAE3ch"
                                    aria-describedby="tier-extended"
                                    className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Choose Extended Plan
                                </a>
                            </div>

                            {/* Teams Plan */}
                            <div className="flex flex-col justify-between rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                                <div>
                                    <h3 id="tier-teams" className="text-base font-semibold leading-7 text-indigo-600">
                                        Teams
                                    </h3>
                                    <p className="text-base leading-7 text-gray-600">
                                        Pay per seat for your team.
                                    </p>
                                    <div className="mt-2 border-t border-gray-200 pt-6" />
                                    <div className="flex items-baseline gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">Get in touch</span>
                                    </div>
                                    <div className="mt-6 border-t border-gray-200 pt-6" />
                                    <p className="text-base leading-7 text-gray-600">
                                        Includes:
                                    </p>
                                    <ul role="list" className="mt-6 space-y-4 text-sm leading-6 text-gray-600">
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Unlimited members (share with your family, friends, coach, psychologist, doctor, etc.)
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            All Mediar features
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            App updates during the subscription
                                        </li>
                                    </ul>
                                </div>
                                <a
                                    href="https://cal.com/louis030195/feedback"
                                    aria-describedby="tier-teams"
                                    className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Contact Us for Teams Plan
                                </a>
                            </div>
                        </div >
                    </div>
                </div>
            </div>
        </div >
    )
}

function Executive() {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">

                    {/* Executive Plan */}
                    <div className="rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-900/10 sm:p-10 lg:flex">

                        <div className="lg:w-1/2 lg:flex-none">
                            <h3 className="text-xl font-semibold leading-8 text-gray-900">Executive</h3>

                            <div className="mt-4 flex items-baseline">
                                <span className="text-5xl font-bold tracking-tight text-gray-900">
                                    $499
                                </span>

                                <span className="ml-1 text-xl font-semibold leading-7 text-gray-600">
                                    /week
                                </span>
                            </div>

                            <p className="mt-6 text-base leading-7 text-gray-600">
                                For the busy executive who wants to reach peak performance.
                            </p>
                            <p className="mt-6 text-base leading-7 text-gray-600">
                                For the coach who wants to help their clients reach peak performance.
                            </p>
                            <a
                                href="https://cal.com/louis030195/executive"
                                aria-describedby="tier-executive"
                                className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Choose Executive Plan
                            </a>
                        </div>

                        <div className="mt-10 lg:mt-0 lg:ml-10 lg:flex-1">
                            <ul role="list" className="space-y-6 text-sm leading-6 text-gray-600">
                                <li className="flex gap-x-3">
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                                    We handle it all - we'll ship you the perfect wearable device and seamlessly integrate the data.
                                </li>

                                <li className="flex gap-x-3">
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                                    Custom integrations to the products you use (e.g. apple, blood test, fitbit, etc.)
                                </li>

                                <li className="flex gap-x-3">
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                                    Custom AI according to your needs and goals (e.g. focus, sleep, etc.)
                                </li>

                                <li className="flex gap-x-3">
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                                    Weekly 1:1 with the founder
                                </li>

                                <li className="flex gap-x-3">
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                                    Instant support (max 20-minutes response time)
                                </li>
                                <li className="flex gap-x-3">
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                                    Private AI and database
                                </li>
                            </ul>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    )
}