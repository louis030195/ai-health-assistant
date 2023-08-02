
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PropsWithChildren } from 'react';
import 'styles/main.css';

const meta = {
    title: 'Mediar',
    description: 'Become laser focused',
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

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children
}: PropsWithChildren) {
    return (
        <div className="flex flex-col h-screen">
            <main className="flex flex-1">
                {/* <aside className="p-4 w-64"> */}
                {/* </aside> */}

                <div className="flex justify-center flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
