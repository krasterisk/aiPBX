import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localstorage'

i18n
  .use(Backend)
  .use(LanguageDetector)
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
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LOCAL_STORAGE_LOCALE_KEY
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  })

export default i18n
