import { useEffect } from 'react'

export interface PageMetaOptions {
  title: string
  description: string
  path?: string
  ogImage?: string
  jsonLd?: Record<string, unknown>
  /** When false, skip writing head (wait for i18n). Default true. */
  ready?: boolean
}

/** i18next returns the key itself when the namespace is not loaded yet. */
export function isUnresolvedI18nValue (value: string): boolean {
  return /^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)+$/.test(value.trim())
}

const SITE_NAME = 'AI PBX'
const DEFAULT_OG_IMAGE = '/assets/og-default.png'
const SITE_URL = typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : 'https://aipbx.net'
const RU_SITE_URL = 'https://aipbx.ru'

function upsertMeta (attr: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attr}="${key}"]`
  const existing = document.head.querySelector(selector)
  let el: HTMLMetaElement
  if (existing instanceof HTMLMetaElement) {
    el = existing
  } else {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical (href: string): void {
  const existing = document.head.querySelector('link[rel="canonical"]')
  let el: HTMLLinkElement
  if (existing instanceof HTMLLinkElement) {
    el = existing
  } else {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertHreflang (lng: string, href: string): void {
  const selector = `link[rel="alternate"][hreflang="${lng}"]`
  const existing = document.head.querySelector(selector)
  let el: HTMLLinkElement
  if (existing instanceof HTMLLinkElement) {
    el = existing
  } else {
    el = document.createElement('link')
    el.rel = 'alternate'
    el.setAttribute('hreflang', lng)
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertJsonLd (data: Record<string, unknown>): void {
  const existing = document.head.querySelector('#page-jsonld')
  let el: HTMLScriptElement
  if (existing instanceof HTMLScriptElement) {
    el = existing
  } else {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'page-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function setPageMeta ({ title, description, path, ogImage, jsonLd }: PageMetaOptions): void {
  if (!title || isUnresolvedI18nValue(title) || isUnresolvedI18nValue(description)) {
    return
  }

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:image', `${SITE_URL}${ogImage || DEFAULT_OG_IMAGE}`)

  if (path) {
    upsertCanonical(`${SITE_URL}${path}`)
    upsertMeta('property', 'og:url', `${SITE_URL}${path}`)
    upsertHreflang('en', `${SITE_URL}${path}`)
    upsertHreflang('ru', `${RU_SITE_URL}${path}`)
    upsertHreflang('x-default', `${SITE_URL}${path}`)
  }

  if (jsonLd) {
    upsertJsonLd(jsonLd)
  }
}

export function usePageMeta (options: PageMetaOptions): void {
  const ready = options.ready !== false
  useEffect(() => {
    if (!ready) return
    setPageMeta(options)
  }, [ready, options.title, options.description, options.path, options.ogImage, options.jsonLd])
}
