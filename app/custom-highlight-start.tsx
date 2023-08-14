'use client'
import { H } from '@highlight-run/next/client'
import { useEffect } from 'react';

export function CustomHighlightStart() {
	useEffect(() => {
		const shouldStartHighlight = window.location.hostname === 'https://mediar.ai'

		if (shouldStartHighlight) {
			H.start();

			return () => {
				H.stop()
			}
		}
	})

	return null
}

