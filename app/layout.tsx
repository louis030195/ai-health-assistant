import SupabaseProvider from './supabase-provider';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import PHProvider from './posthog-provider';
import * as Sentry from '@sentry/browser'
import posthog from 'posthog-js'
import dynamic from 'next/dynamic'

if (process.env.SENTRY_ENABLED !== 'false' && process.env.ENVIRONMENT && process.env.ENVIRONMENT !== 'development') {
  console.log('init sentry')
  Sentry.init({
    dsn: "https://d991f2934a8a47e3ab3c6f5789a6c4ca@o4505591122886656.ingest.sentry.io/4505591123607552",
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
      new posthog.SentryIntegration(posthog, 'mediar', 4505591123607552)
    ],
    // Performance Monitoring
    tracesSampleRate: 0, // Capture 0% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

const meta = {
  title: 'Mediar',
  description: 'ChatGPT x Neurosity',
  // cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://mediar.ai',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  // cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    // cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mediar',
    title: meta.title,
    description: meta.description,
    // cardImage: meta.cardImage
  }
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: PropsWithChildren) {

  const CrispWithNoSSR = dynamic(
    () => import('@/components/ui/CrispChat'),
  )
  return (
    <html lang="en">
      <CrispWithNoSSR />
      <body className="bg-white loading">
        <PHProvider>
          <SupabaseProvider>
            <Navbar />
            <main
              id="skip"
              className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] mb-80"
            >
              {children}
            </main>
            <Footer />
          </SupabaseProvider>
        </PHProvider>
      </body>
    </html>
  );
}
