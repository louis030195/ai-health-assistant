// instrumentation.ts

export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		/** Conditional import required for use with Next middleware to avoid a webpack error 
         * https://nextjs.org/docs/pages/building-your-application/routing/middleware */
		const { registerHighlight } = await import('@highlight-run/next/server')

		registerHighlight({
			projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID!,
		})
	}
}
