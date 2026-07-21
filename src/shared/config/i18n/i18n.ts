import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localstorage'

function lookupSiteUrlLng (): string | undefined {
  try {
    const siteUrl = typeof __SITE_URL__ !== 'undefined' && __SITE_URL__
      ? String(__SITE_URL__)
      : ''
    if (siteUrl.includes('aipbx.ru')) return 'ru'
    if (siteUrl.includes('aipbx.net') || siteUrl.includes('aipbx.org')) return 'en'
  } catch {
    // ignore — DefinePlugin may be absent in some test harnesses
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host.endsWith('aipbx.ru')) return 'ru'
    if (host.endsWith('aipbx.net') || host.endsWith('aipbx.org')) return 'en'
  }

  return undefined
}

const languageDetector = new LanguageDetector()
languageDetector.addDetector({
  name: 'siteUrl',
  lookup: lookupSiteUrlLng,
})

i18n
  .use(Backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['ru', 'en', 'de', 'zh'],
    load: 'languageOnly',
    // debug: __IS_DEV__,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    detection: {
      // Prefer saved user choice, then build/runtime site segment (.net → en),
      // then browser language. Prevents RU OS locale freezing .net prerender.
      order: ['localStorage', 'siteUrl', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LOCAL_STORAGE_LOCALE_KEY
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  })

export default i18n
