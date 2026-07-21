import { useEffect } from 'react'

/**
 * Signals prerender (@prerenderer) that meta/i18n are ready.
 * Dispatches on document so renderAfterDocumentEvent: 'seo-render-ready' can snapshot.
 */
export function useSeoRenderReady (ready: boolean): void {
  useEffect(() => {
    if (!ready) return
    document.dispatchEvent(new Event('seo-render-ready'))
  }, [ready])
}
