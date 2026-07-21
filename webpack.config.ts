import { config as loadEnv } from 'dotenv'
import { buildWebpackConfig } from './config/build/buildWebpackConfig'
import { type buildEnv, type buildPaths } from './config/build/types/config'
import path from 'path'

loadEnv({ path: path.resolve(__dirname, '.env.local') })
loadEnv({ path: path.resolve(__dirname, '.env') })

export default (env: buildEnv) => {
  const paths: buildPaths = {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    build: path.resolve(__dirname, 'build'),
    html: path.resolve(__dirname, 'public', 'index.html'),
    src: path.resolve(__dirname, 'src'),
    locales: path.resolve(__dirname, 'public', 'locales'),
    buildLocales: path.resolve(__dirname, 'build', 'locales'),
    favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
    assets: path.resolve(__dirname, 'public', 'assets'),
    buildAssets: path.resolve(__dirname, 'build', 'assets')
  }

  const mode = env?.mode || 'development'
  const isDev = mode === 'development'
  const PORT = Number(env?.port || process.env.PORT || 3000)
  const apiUrl = env?.apiUrl || process.env.API_URL || '/api'
  const wsUrl = env?.wsUrl ?? process.env.WS_URL ?? ''
  const staticUrl = env?.staticUrl || process.env.STATIC_URL || '/static'
  const googleClientId = env?.googleClientId || process.env.GOOGLE_CLIENT_ID || ''
  const tgBotId = env?.tgBotId || process.env.TELEGRAM_BOT_ID || ''
  const stripePublishableKey = env?.stripePublishableKey || process.env.STRIPE_PUBLISHABLE_KEY || ''
  const sentryDsn = process.env.SENTRY_DSN || ''
  const sentryEnvironment = process.env.SENTRY_ENVIRONMENT || mode
  const yandexMetrikaId = process.env.YANDEX_METRIKA_ID || ''
  const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID || ''
  const siteUrl = process.env.SITE_URL || 'https://aipbx.net'
  const googleAdsId = process.env.GOOGLE_ADS_ID || ''
  const adsSignupLabel = process.env.ADS_SIGNUP_LABEL || ''

  return buildWebpackConfig({
    mode,
    isDev,
    paths,
    port: PORT,
    apiUrl,
    wsUrl,
    project: 'frontend',
    staticUrl,
    googleClientId,
    tgBotId,
    stripePublishableKey,
    sentryDsn,
    sentryEnvironment,
    yandexMetrikaId,
    ga4MeasurementId,
    siteUrl,
    googleAdsId,
    adsSignupLabel
  })
}
