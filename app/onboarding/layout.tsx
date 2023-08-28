
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import Steps from './Steps';
import MobileWarning from './MobileWarning';
import { getSession, saveOnboarding } from '../supabase-server';
export const dynamic = "force-dynamic";

const meta = {
    title: 'Mediar',
    description: 'One health assistant for all your wearables',
    cardImage: '/logo.png',
    robots: 'follow, index',
    favicon: '/favicon.ico',
    url: 'https://mediar.ai',
    type: 'website'
};

export const metadata = {
    metadataBase: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    robots: meta.robots,
    favicon: meta.favicon,
    url: meta.url,
    type: meta.type,
    openGraph: {
        url: meta.url,
        title: meta.title,
        description: meta.description,
        cardImage: meta.cardImage,
        type: meta.type,
        site_name: meta.title
    },
    twitter: {
        card: 'summary_large_image',
        site: '@mediar_ai',
        title: meta.title,
        description: meta.description,
        cardImage: meta.cardImage
    }
};

export default function Layout({
    children
}: PropsWithChildren) {

    const onFinish = async () => {
        'use server'
        const session = await getSession();

        await saveOnboarding(session!.user.id);
    }

    return (
        <div className="space-y-4">
            {children}
            {/* on mobile just at bottom */}
            <Steps className="lg:bottom-0 lg:left-0 lg:right-0 lg:fixed" onEnd={onFinish} />
        </div>
    );
}
