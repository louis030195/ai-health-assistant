
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import Steps from './Steps';
import MobileWarning from './MobileWarning';

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
        site: '@vercel',
        title: meta.title,
        description: meta.description,
        cardImage: meta.cardImage
    }
};

export default function Layout({
    children
}: PropsWithChildren) {
    return (
        <div>
            <MobileWarning />
            {children}
            {/* divider */}
            {/* position fixed floating bottom screen */}
            <Steps className="fixed bottom-10 left-0 right-0" />
        </div>
    );
}
