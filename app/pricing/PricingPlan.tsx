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
                        Achieve peak performance with Mediar, your personal AI coach based on your brain data.
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

                            {/* Hobby Plan */}
                            <div className="flex flex-col justify-between rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                                <div>
                                    <h3 id="tier-hobby" className="text-base font-semibold leading-7 text-indigo-600">
                                        Hobby
                                    </h3>

                                    <div className="mt-4 flex items-baseline gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">Free</span>
                                    </div>

                                    <p className="mt-6 text-base leading-7 text-gray-600">
                                        For those looking to dip their toes into attention training
                                    </p>

                                    {/* Features */}
                                    <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Simple analytics
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Email support
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Discord support
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Max 6-hour support response time
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Limited AI usage
                                        </li>
                                    </ul>
                                </div>

                                <a
                                    href="/signin"
                                    aria-describedby="tier-hobby"
                                    className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                                >
                                    Get started today
                                </a>
                            </div>



                            {/* Biohacker Plan */}
                            <div className="flex flex-col justify-between rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                                <div>
                                    <h3 id="tier-biohacker" className="text-base font-semibold leading-7 text-indigo-600">
                                        Biohacker
                                    </h3>

                                    <div className="mt-4 flex items-baseline gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">$19.99</span>
                                        <span className="text-sm font-semibold leading-7 text-gray-600">/month</span>
                                    </div>

                                    <p className="mt-6 text-base leading-7 text-gray-600">
                                        Access to premium features
                                    </p>

                                    {/* Features */}
                                    <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            WhatsApp integration <HoverCard>
                                                <HoverCardTrigger>
                                                    <QuestionMarkCircleIcon width={20} className="text-indigo-600" />
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-[800px] h-[600px]">
                                                    <iframe src="https://link.excalidraw.com/p/readonly/cHcTRMmQ0XX3NzUpQZ6I" width="100%" height="100%"></iframe>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Early access to beta features
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Founder phone number
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            WhatsApp support (max 3-hours response time)
                                        </li>
                                    </ul>
                                </div>

                                <Button
                                    onClick={onBiohacker}
                                    aria-describedby="tier-biohacker"
                                    // purple borders and shadow
                                    className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                                >
                                    {
                                        biohackerLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    }
                                    Invest in yourself
                                </Button>
                            </div>


                            {/* Executive Plan */}
                            <div className="flex flex-col justify-between rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                                <div>
                                    <h3 id="tier-executive" className="text-base font-semibold leading-7 text-indigo-600">
                                        Executive
                                    </h3>

                                    <div className="mt-4 flex items-baseline gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">$499</span>
                                        <span className="text-base font-semibold leading-7 text-gray-600">/week</span>
                                    </div>

                                    <p className="mt-6 text-base leading-7 text-gray-600">
                                        For the busy and ambitious executive that want to reach peak performance
                                    </p>

                                    {/* Features */}
                                    <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            We handle it all - we'll ship you the perfect wearable device and seamlessly integrate the data.
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Custom integrations to the products you use (e.g. apple, blood test, fitbit, etc.)
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Custom AI according to your needs and goals (e.g. focus, sleep, etc.)
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            Weekly 1:1 with the founder
                                        </li>
                                        <li className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            WhatsApp support (max 20-minutes response time)
                                        </li>
                                    </ul>
                                </div>

                                <a
                                    href="https://cal.com/louis030195/executive"
                                    aria-describedby="tier-executive"
                                    className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Coffee with the founder in SF
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}