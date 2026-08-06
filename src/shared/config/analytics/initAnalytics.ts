declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function loadScript (src: string): void {
  if (document.querySelector(`script[src="${src}"]`)) {
    return
  }
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function initAnalytics (): void {
  const metrikaId = typeof __YANDEX_METRIKA_ID__ !== 'undefined' ? __YANDEX_METRIKA_ID__ : ''
  const ga4Id = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''
  const adsId = typeof __GOOGLE_ADS_ID__ !== 'undefined' ? __GOOGLE_ADS_ID__ : ''

  if (metrikaId) {
    const id = Number(metrikaId)
    if (!Number.isNaN(id)) {
      loadScript('https://mc.yandex.ru/metrika/tag.js')
      const ymStub = function (...args: unknown[]) {
        ymStub.a.push(args)
      } as ((id: number, method: string, ...args: unknown[]) => void) & { a: unknown[] }
      ymStub.a = []
      window.ym = window.ym || ymStub
      window.ym(id, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false })
    }
  }

  if (ga4Id) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`)
    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id, { send_page_view: false })
  }

  if (adsId && window.gtag) {
    window.gtag('config', adsId)
  }
}

export function trackEvent (name: string, params?: Record<string, string | number>): void {
  const metrikaId = typeof __YANDEX_METRIKA_ID__ !== 'undefined' ? __YANDEX_METRIKA_ID__ : ''
  const ga4Id = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''

  if (metrikaId && window.ym) {
    window.ym(Number(metrikaId), 'reachGoal', name, params)
  }

  if (ga4Id && window.gtag) {
    window.gtag('event', name, params)
  }
}

/** Google Ads conversion only - do not dual-dispatch to Metrika; never pass PII (email/tokens). */
export function fireAdsConversion (label: string, params: Record<string, unknown> = {}): void {
  const adsId = typeof __GOOGLE_ADS_ID__ !== 'undefined' ? __GOOGLE_ADS_ID__ : ''
  if (adsId && window.gtag) {
    window.gtag('event', 'conversion', { send_to: `${adsId}/${label}`, ...params })
  }
}
