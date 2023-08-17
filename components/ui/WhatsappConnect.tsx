'use client'
import { useState } from 'react';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './button';
import { Loader2 } from 'lucide-react';
import { Input } from './input';
import { Toaster } from './toaster';
import toast from 'react-hot-toast';
import { Database } from '@/types_db';
type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type UserDetails = Database['public']['Tables']['users']['Row'];

interface Prop {
    session: Session;
    subscription?: Subscription;
    userDetails?: UserDetails
}
export default function WhatsappConnect({ session, subscription, userDetails }: Prop) {
    const supabase = createClientComponentClient();

    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(userDetails?.phone || '');

    const handleConnect = async () => {
        setLoading(true);

        const toastId = toast.loading('Sending you a WhatsApp message...');

        try {
            // const { data, error } = await supabase.auth.signInWithOtp({
            //     phone: phoneNumber,
            //     options: {
            //         // shouldCreateUser: false,
            //         channel: 'whatsapp'
            //     }
            // });

            // console.log(data, error);
            // if (error) throw error;

            // const otp = prompt('Enter the OTP you received on WhatsApp');

            // const { error: error2 } = await supabase.auth.verifyOtp({
            //     phone: phoneNumber,
            //     token: otp!,
            //     type: 'sms',
            // });

            // if (error2) throw error;

            // alert('WhatsApp connected successfully!');

            const { error } = await supabase.from('users').update({
                phone: phoneNumber,
                phone_verified: true // TODO: real verif
            }).eq('id', session.user?.id);

            if (error) throw error;

            toast.success('WhatsApp connected successfully!', { id: toastId });
            toast.success('Thank you for trying the beta integration of WhatsApp. Any issues, please contact us 🙏')

        } catch (error: any) {
            // alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <Toaster />

            <h2 className="text-2xl font-bold mb-4">Connect WhatsApp</h2>

            <p className="text-gray-500 mb-4">
                Connect your WhatsApp account to receive insights and send tags directly on WhatsApp.
            </p>
            {/* Phone number input */}
            <Input
                type="text"
                placeholder="Enter phone number"
                className="mb-4 text-black"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
                onClick={handleConnect}
                disabled={loading || !subscription}
                className="w-full"
            >
                {
                    loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                }
                Connect WhatsApp
            </Button>

        </div>
    );

}