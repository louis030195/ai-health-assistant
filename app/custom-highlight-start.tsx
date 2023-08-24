'use client'
import { H } from '@highlight-run/next/client'
import { useEffect } from 'react';

export function CustomHighlightStart() {
	useEffect(() => {
		const shouldStartHighlight = window.location.hostname.includes('mediar.ai')

		if (shouldStartHighlight) {
			H.start();
			console.log('started highlight')

			return () => {
				H.stop()
			}
		}
	})

	return null
}

