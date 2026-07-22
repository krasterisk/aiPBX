import { useEffect } from 'react'

/**
 * Signals prerender (@prerenderer) that meta/i18n are ready.
 * Dispatches on document so renderAfterDocumentEvent: 'seo-render-ready' can snapshot.
 * rAF: run after sibling usePageMeta effect in the same commit so <title> is not a raw i18n key.
 */
export function useSeoRenderReady (ready: boolean): void {
  useEffect(() => {
    if (!ready) return
    const id = window.requestAnimationFrame(() => {
      document.dispatchEvent(new Event('seo-render-ready'))
    })
    return () => { window.cancelAnimationFrame(id) }
  }, [ready])
}
