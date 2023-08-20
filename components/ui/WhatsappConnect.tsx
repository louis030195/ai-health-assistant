'use client'
import { useState } from 'react';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './button';
import { Loader2 } from 'lucide-react';
import { Input } from './input';
import toast, { Toaster } from 'react-hot-toast';
import { Database } from '@/types_db';
import { VerificationData, VerificationResponse } from '@/app/whatsapp-server';
type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type UserDetails = Database['public']['Tables']['users']['Row'];

interface Prop {
    session: Session;
    startVerification: (phoneNumber: string) => Promise<VerificationData>;
    verifyOtp: (phoneNumber: string, otp: string) => Promise<VerificationResponse>;
    subscription?: Subscription;
    userDetails?: UserDetails;
}
export default function WhatsappConnect({ session, subscription, userDetails, startVerification, verifyOtp }: Prop) {
    const supabase = createClientComponentClient();

    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(userDetails?.phone || '');

    const handleConnect = async () => {
        setLoading(true);

        const toastId = toast.loading('Sending you a WhatsApp message...');

        try {
            await startVerification(phoneNumber);

            const otp = prompt('Enter the OTP you received on WhatsApp');

            toast.loading('Verifying OTP...', { id: toastId });
            const response = await verifyOtp(phoneNumber, otp!);

            if (response.status !== 'approved') throw new Error('Invalid OTP:' + response);

            const { error } = await supabase.from('users').update({
                phone: phoneNumber,
                phone_verified: true
            }).eq('id', session.user?.id);

            if (error) throw error;

            toast.success('WhatsApp connected successfully!', { id: toastId });
            toast.success('Thank you for trying the beta integration of WhatsApp. Any issues, please contact us 🙏')

        } catch (error: any) {
            toast.error(error.message, { id: toastId });
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

            {/* small text saying that you should receive a whatsapp message from Mediar AI upon first time adding your phone number */}
            <p className="text-gray-500 mt-4">
                You will receive a WhatsApp message from Mediar AI to confirm your number. Any issues, <a href="mailto:louis@mediar.ai" className="text-blue-500 underline">please contact us 🙏</a>.
            </p>

        </div>
    );

}