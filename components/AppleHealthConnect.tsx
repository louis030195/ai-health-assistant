'use client'
import React from 'react';
import { Button } from './ui/button';

const AppleHealthConnect = ({ customTitle, appStoreLink }: { customTitle?: string, appStoreLink: string }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
            <h2

                className="text-center text-lg font-bold mb-4">
                {
                    customTitle ? customTitle :
                        "You need to install our iOS app to connect with Apple Health"
                }</h2>
            <Button
                onClick={() => window.open(appStoreLink, '_blank')}
                className='w-4/5 shadow-none'>
                Click here to install the app
            </Button>
            <p className="text-center text-sm mt-2">
                Note: You will need to install TestFlight from the App Store first.
            </p>
        </div>
    );
};

export default AppleHealthConnect;