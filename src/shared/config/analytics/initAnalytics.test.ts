import { fireAdsConversion, initAnalytics } from './initAnalytics'

describe('initAnalytics', () => {
  const originalGa4 = (global as any).__GA4_MEASUREMENT_ID__
  const originalAds = (global as any).__GOOGLE_ADS_ID__
  const originalLabel = (global as any).__ADS_SIGNUP_LABEL__
  const originalMetrika = (global as any).__YANDEX_METRIKA_ID__

  beforeEach(() => {
    jest.clearAllMocks()
    window.dataLayer = []
    window.gtag = jest.fn()
    ;(global as any).__YANDEX_METRIKA_ID__ = ''
    ;(global as any).__GA4_MEASUREMENT_ID__ = ''
    ;(global as any).__GOOGLE_ADS_ID__ = ''
    ;(global as any).__ADS_SIGNUP_LABEL__ = ''
  })

  afterEach(() => {
    ;(global as any).__GA4_MEASUREMENT_ID__ = originalGa4
    ;(global as any).__GOOGLE_ADS_ID__ = originalAds
    ;(global as any).__ADS_SIGNUP_LABEL__ = originalLabel
    ;(global as any).__YANDEX_METRIKA_ID__ = originalMetrika
    delete window.gtag
    delete window.dataLayer
    document.head.querySelectorAll('script').forEach((el) => el.remove())
  })

  it('configures GA4 with send_page_view:false and Ads when both IDs are set', () => {
    ;(global as any).__GA4_MEASUREMENT_ID__ = 'G-G1KZQCKP5D'
    ;(global as any).__GOOGLE_ADS_ID__ = 'AW-16711221644'

    initAnalytics()

    const calls = window.dataLayer as unknown[][]
    expect(calls).toContainEqual(['config', 'G-G1KZQCKP5D', { send_page_view: false }])
    expect(calls).toContainEqual(['config', 'AW-16711221644'])
  })

  it('fireAdsConversion sends conversion with send_to adsId/label', () => {
    ;(global as any).__GOOGLE_ADS_ID__ = 'AW-16711221644'
    window.gtag = jest.fn()

    fireAdsConversion('-B6_CK72wtMcEIyDxKA-')

    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-16711221644/-B6_CK72wtMcEIyDxKA-'
    })
  })

  it('fireAdsConversion merges extra params into the conversion payload', () => {
    ;(global as any).__GOOGLE_ADS_ID__ = 'AW-16711221644'
    window.gtag = jest.fn()

    fireAdsConversion('-B6_CK72wtMcEIyDxKA-', { value: 1, currency: 'USD' })

    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-16711221644/-B6_CK72wtMcEIyDxKA-',
      value: 1,
      currency: 'USD'
    })
  })

  it('fireAdsConversion is a no-op when Ads ID is unset', () => {
    ;(global as any).__GOOGLE_ADS_ID__ = ''
    window.gtag = jest.fn()

    fireAdsConversion('-B6_CK72wtMcEIyDxKA-')

    expect(window.gtag).not.toHaveBeenCalled()
  })

  it('fireAdsConversion is a no-op when window.gtag is undefined', () => {
    ;(global as any).__GOOGLE_ADS_ID__ = 'AW-16711221644'
    delete window.gtag

    expect(() => fireAdsConversion('-B6_CK72wtMcEIyDxKA-')).not.toThrow()
  })
})
