import i18n from './i18n'

describe('document language', () => {
  beforeAll(async () => {
    await i18n.init({
      lng: 'en',
      resources: { en: { translation: {} }, ru: { translation: {} }, de: { translation: {} } }
    })
  })

  it.each(['ru', 'en', 'de'])('updates html lang when UI language changes to %s', async (lng) => {
    await i18n.changeLanguage(lng)
    expect(document.documentElement.lang).toBe(lng)
  })
})
