'use client'
import React, { ReactNode } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ArrowPathIcon, CheckBadgeIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Database } from '@/types_db';
import { useRouter } from 'next/navigation';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Loader2 } from 'lucide-react';
import { Session, User } from '@supabase/supabase-js';
import ManageSubscriptionButton from '@/app/account/ManageSubscriptionButton';
import posthog from 'posthog-js'
import { usePostHog } from 'posthog-js/react'

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];


interface RibbonProps {
  price?: Price
  subscription?: Subscription
  displayText: string;
  session: Session;
  children?: ReactNode; // Add this line for the children prop
}

const PlanRibbon: React.FC<RibbonProps> = ({ session, price, subscription, displayText, children }) => {
  const [biohackerLoading, setBiohackerLoading] = React.useState(false);
  const router = useRouter();
  const posthog = usePostHog()
  const flag = posthog.isFeatureEnabled('whatsapp')

  const handleClick = async () => {
    setBiohackerLoading(true);

    // if (subscription) {
    //   return router.push('/account');
    // }
    // try {
    //   const { sessionId } = await postData({
    //     url: '/api/create-checkout-session',
    //     data: { price: price! },
    //   });

    //   const stripe = await getStripe();
    //   stripe?.redirectToCheckout({ sessionId });
    // } catch (error) {
    //   return alert((error as Error)?.message);
    // } finally {
    //   setBiohackerLoading(false);
    // }


    const url = 'https://cal.com/louis030195/beta';
    router.push(url);

  };

  return (
    <div className="relative overflow-hidden rounded-lg">

      {flag !== true &&
        <div
          className="absolute left-[-80px] top-[46px] w-72 h-10 bg-black rounded-br-lg z-10 shadow-lg cursor-pointer transform -rotate-45 items-center justify-center"
          onClick={handleClick}
        >
          <div className="text-white flex items-center justify-center font-bold text-lg">
            {
              biohackerLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            }
            {displayText}
          </div>

        </div>
      }
      <div className="bg-white rounded-lg shadow p-6 relative z-0">
        {children} {/* Render the children here */}
      </div>
      {
        flag !== true && <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500/50 rounded-lg z-0" />
      }
    </div>
  );
};

export default PlanRibbon;
