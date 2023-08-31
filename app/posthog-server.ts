// app/posthog.js
import { PostHog } from 'posthog-node'

export default function PostHogClient() {
  const posthogClient = new PostHog('phc_V7co1flWmfnd9Hd6LSyPRau9sARsxMEiOrmNvGeUhbJ', {
    host: 'https://app.posthog.com',
    flushAt: 1,
    flushInterval: 0
  })
  return posthogClient
}