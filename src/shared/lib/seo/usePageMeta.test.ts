import { isUnresolvedI18nValue, setPageMeta } from './usePageMeta'

describe('setPageMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  it('writes description, absolute canonical/og from SITE_URL, hreflang, and JSON-LD', () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Speech Analytics'
    }

    setPageMeta({
      title: 'Speech Analytics',
      description: 'AI call analytics for teams',
      path: '/speech-analytics',
      jsonLd
    })

    const description = document.head.querySelector('meta[name="description"]')
    expect(description).toBeInstanceOf(HTMLMetaElement)
    expect((description as HTMLMetaElement).content).toBe('AI call analytics for teams')

    const canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement
    expect(canonical.href).toBe('https://aipbx.net/speech-analytics')
    expect(canonical.href).not.toContain('localhost')

    const ogUrl = document.head.querySelector('meta[property="og:url"]') as HTMLMetaElement
    expect(ogUrl.content).toBe('https://aipbx.net/speech-analytics')

    const ogImage = document.head.querySelector('meta[property="og:image"]') as HTMLMetaElement
    expect(ogImage.content).toBe('https://aipbx.net/assets/og-default.png')

    const hreflangEn = document.head.querySelector(
      'link[rel="alternate"][hreflang="en"]'
    ) as HTMLLinkElement
    expect(hreflangEn.href).toBe('https://aipbx.net/speech-analytics')

    const hreflangRu = document.head.querySelector(
      'link[rel="alternate"][hreflang="ru"]'
    ) as HTMLLinkElement
    expect(hreflangRu.href).toBe('https://aipbx.ru/speech-analytics')

    const hreflangDefault = document.head.querySelector(
      'link[rel="alternate"][hreflang="x-default"]'
    ) as HTMLLinkElement
    expect(hreflangDefault.href).toBe('https://aipbx.net/speech-analytics')

    const script = document.head.querySelector(
      'script#page-jsonld[type="application/ld+json"]'
    ) as HTMLScriptElement
    expect(JSON.parse(script.textContent || '')).toEqual(jsonLd)
  })

  it('is idempotent - second call does not duplicate canonical or JSON-LD', () => {
    const jsonLd = { '@type': 'WebPage', name: 'Speech Analytics' }

    setPageMeta({
      title: 'Speech Analytics',
      description: 'desc',
      path: '/speech-analytics',
      jsonLd
    })
    setPageMeta({
      title: 'Speech Analytics Updated',
      description: 'desc updated',
      path: '/speech-analytics',
      jsonLd: { ...jsonLd, name: 'Updated' }
    })

    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('#page-jsonld')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="alternate"][hreflang="en"]')).toHaveLength(1)

    const script = document.head.querySelector('#page-jsonld') as HTMLScriptElement
    expect(JSON.parse(script.textContent || '').name).toBe('Updated')
  })

  it('does not write head when title is an unresolved i18n key', () => {
    setPageMeta({
      title: 'VoiceAssistantsPage.meta.title',
      description: 'VoiceAssistantsPage.meta.description',
      path: '/voice-assistants'
    })
    expect(document.title).toBe('')
    expect(document.head.querySelector('meta[name="description"]')).toBeNull()
  })
})

describe('isUnresolvedI18nValue', () => {
  it('detects dotted i18n keys', () => {
    expect(isUnresolvedI18nValue('VoiceAssistantsPage.meta.title')).toBe(true)
    expect(isUnresolvedI18nValue('landing.demoCta.label')).toBe(true)
    expect(isUnresolvedI18nValue('AI Voice Assistant for Business')).toBe(false)
  })
})
