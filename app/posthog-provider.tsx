'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
    posthog.init('phc_V7co1flWmfnd9Hd6LSyPRau9sARsxMEiOrmNvGeUhbJ', {
        api_host: 'https://app.posthog.com'
    })
}

export default function PHProvider({ children }: {
    children: React.ReactNode;
}) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}