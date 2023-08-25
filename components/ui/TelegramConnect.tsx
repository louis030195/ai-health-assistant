'use client'

import { useEffect, useState } from 'react';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './button';
import { Loader2, Save, Send, TwitterIcon } from 'lucide-react';
import { Input } from './input';
import toast, { Toaster } from 'react-hot-toast';
import { Database } from '@/types_db';
import { VerificationData, VerificationResponse } from '@/app/whatsapp-server';
import OtpInput from 'react-otp-input';
import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';
import ShimmerButton from '../magicui/shimmer-button';
import { Icons } from './icons';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type UserDetails = Database['public']['Tables']['users']['Row'];

interface Prop {
    session: Session;
    sendTelegramMessage: (to: string, text: string) => Promise<void>
    subscription?: Subscription;
    userDetails?: UserDetails;
}


export default function TelegramConnect({ session, userDetails, sendTelegramMessage }: Prop) {
    const supabase = createClientComponentClient();
    const [telegramUsernameLoading, setTelegramUsernameLoading] = useState(false);
    const [telegramUsername, setTelegramUsername] = useState(userDetails?.telegram_username || '');

    const handleSetTelegramUsername = async (number: string) => {
        setTelegramUsernameLoading(true);
        // 1. check if this username is already taken
        const { data, error } = await supabase.from('users').select('id')
            .neq('id', session.user?.id)
            .eq('telegram_username', number).limit(1);
        if (error) {
            console.error(error);
            toast.error('Error saving Telegram username. Please try again.');
            setTelegramUsernameLoading(false);

            return;
        }
        if (data?.length === 1) {
            toast.error('Telegram username already taken. Please try another one.');
            setTelegramUsernameLoading(false);
            console.log(data);
            return;
        }
        const { error: e2 } = await supabase.from('users').update({
            telegram_username: telegramUsername,
        }).eq('id', session.user?.id);
        setTelegramUsernameLoading(false);
        if (e2) {
            console.error(error);
            toast.error('Error saving Telegram username. Please try again.');
            return;
        }
        setTelegramUsername(number);
        toast.success('Telegram username saved successfully!');
    }


    return (
        <div className="bg-white rounded-lg shadow p-6 gap-4 flex-col justify-center items-center space-y-4">
            <Toaster />

            <h2 className="text-2xl font-bold mb-4 text-black text-center">Connect Telegram</h2>
            <Icons.telegram

                className="h-12 w-12 cursor-pointer text-black"

                onClick={() => window.open('https://t.me/mediar_ai_bot', '_blank')} />
            <p className="text-gray-500 mb-4">
                Connect your Telegram account to receive insights and send tags directly on Telegram.
            </p>


            <div className="flex flex-col items-center justify-center">
                <Input

                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="Enter Telegram username"
                    className="mb-4 text-black "
                />
                <Button
                    onClick={() => handleSetTelegramUsername(telegramUsername)}
                    disabled={telegramUsernameLoading || !telegramUsername}
                    className="w-full"
                >
                    {
                        telegramUsernameLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                            <Save className="mr-2 h-4 w-4" />
                    }
                    Save Telegram username
                </Button>
            </div>



            <div className="flex flex-col items-center justify-center">
                <Button
                    onClick={() => {
                        window.open('https://t.me/mediar_ai_bot', '_blank');
                    }}
                    disabled={!telegramUsername}
                    className="w-full"
                >
                    <Send className="mr-2 h-4 w-4" />
                    Telegram the bot @mediar_ai_bot
                </Button>
            </div>
            <p className="text-gray-500 mt-4">
                After messaging the bot, you will receive a welcome message.
            </p>
            {/* <div className="flex flex-col items-center justify-center">
                    <Button
                        onClick={handleConnect}
                        disabled={loading}
                        className="w-full"

                    >
                        {
                            loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        }
                        Send me the onboarding message
                    </Button>
                </div>
                <p className="text-gray-500 mt-4">
                    You will receive a Telegram message explaining how to use Mediar.
                </p> */}
        </div>
    );
}