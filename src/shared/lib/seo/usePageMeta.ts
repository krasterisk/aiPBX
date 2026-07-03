import { useEffect } from 'react'

export interface PageMetaOptions {
  title: string
  description: string
  path?: string
  ogImage?: string
}

const SITE_NAME = 'AI PBX'
const DEFAULT_OG_IMAGE = '/assets/og-default.png'

function upsertMeta (attr: 'name' | 'property', key: string, content: string): void {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical (href: string): void {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

export function setPageMeta ({ title, description, path, ogImage }: PageMetaOptions): void {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:image', ogImage || DEFAULT_OG_IMAGE)

  if (path) {
    const origin = window.location.origin
    upsertCanonical(`${origin}${path}`)
    upsertMeta('property', 'og:url', `${origin}${path}`)
  }
}

export function usePageMeta (options: PageMetaOptions): void {
  useEffect(() => {
    setPageMeta(options)
  }, [options.title, options.description, options.path, options.ogImage])
}
