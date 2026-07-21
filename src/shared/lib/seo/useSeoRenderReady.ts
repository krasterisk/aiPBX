import { useEffect } from 'react'

export function useSeoRenderReady (ready: boolean): void {
  useEffect(() => {
    if (ready) {
      document.dispatchEvent(new Event('seo-render-ready'))
    }
  }, [ready])
}
