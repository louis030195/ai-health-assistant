// src/app/utils/highlight.config.ts:
import { Highlight } from '@highlight-run/next/server'

export const withHighlight = Highlight({
   projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID!,
})

