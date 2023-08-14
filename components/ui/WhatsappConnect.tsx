'use client'
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './button';
import { Loader2 } from 'lucide-react';
import { Input } from './input';

export default function WhatsappConnect() {
    const supabase = createClientComponentClient();

    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleConnect = async () => {
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                phone: phoneNumber,
                options: {
                    // shouldCreateUser: false,
                    channel: 'whatsapp'
                }
            });

            console.log(data, error);
            if (error) throw error;

            // const otp = prompt('Enter the OTP you received on WhatsApp');

            // const { error: error2 } = await supabase.auth.verifyOtp({
            //     phone: phoneNumber,
            //     token: otp!,
            //     type: 'sms',
            // });

            // if (error2) throw error;

            // alert('WhatsApp connected successfully!');

        } catch (error: any) {
            // alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-2xl font-bold mb-4">Connect WhatsApp</h2>

            <p className="text-gray-500 mb-4">
                Connect your WhatsApp account to enable OTP login.
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
                disabled={loading}
            >
                {
                    loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                }
                Connect WhatsApp
            </Button>

        </div>
    );

}