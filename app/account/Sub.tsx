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

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];

interface SubProps {
    price?: Price
    subscription?: Subscription
    displayText: string;
    session: Session;
    children?: ReactNode; // Add this line for the children prop
}
const Sub = ({ session, subscription, displayText }: SubProps) => {

    return (
        subscription &&
        <div 
        className="p-4 flex gap-4 flex-col items-center justify-center border-1 border-gray-200 rounded-md min-w-[300px] min-h-[200px] shadow-md">
        
            < div className="flex flex-col items-center justify-center" >
                <CheckBadgeIcon className="ml-2 h-10 w-10 text-green-500" />
                <p className="text-black font-bold text-sm">
                    Biohacker subscription active </p>
            </div >
            <ManageSubscriptionButton session={session} />
        </div >
    )
}

export default Sub;