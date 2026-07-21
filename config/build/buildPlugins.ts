import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import PrerendererWebpackPlugin from '@prerenderer/webpack-plugin'
import { buildOptions } from './types/config'

export function buildPlugins ({
  paths, isDev, apiUrl, wsUrl, project, staticUrl, googleClientId, tgBotId, stripePublishableKey,
  sentryDsn, sentryEnvironment, yandexMetrikaId, ga4MeasurementId,
  siteUrl, googleAdsId, adsSignupLabel
}: buildOptions): webpack.WebpackPluginInstance[] {
  const isProd = !isDev

  const plugins = [
    new HtmlWebpackPlugin({
      template: paths.html,
      siteUrl: siteUrl || 'https://aipbx.net'
    }),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      __IS_DEV__: JSON.stringify(isDev),
      __API__: JSON.stringify(apiUrl),
      __WS__: JSON.stringify(wsUrl),
      __PROJECT__: JSON.stringify(project),
      __STATIC__: JSON.stringify(staticUrl),
      __GOOGLE_CLIENT_ID__: JSON.stringify(googleClientId),
      __TG_BOT_ID__: JSON.stringify(tgBotId),
      __STRIPE_PUBLISHABLE_KEY__: JSON.stringify(stripePublishableKey),
      __SENTRY_DSN__: JSON.stringify(sentryDsn),
      __SENTRY_ENVIRONMENT__: JSON.stringify(sentryEnvironment),
      __YANDEX_METRIKA_ID__: JSON.stringify(yandexMetrikaId),
      __GA4_MEASUREMENT_ID__: JSON.stringify(ga4MeasurementId),
      __SITE_URL__: JSON.stringify(siteUrl),
      __GOOGLE_ADS_ID__: JSON.stringify(googleAdsId),
      __ADS_SIGNUP_LABEL__: JSON.stringify(adsSignupLabel)
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        },
        mode: 'write-references'
      }
    })
  ]

  if (isDev) {
    plugins.push(new ReactRefreshWebpackPlugin())
    plugins.push(new webpack.HotModuleReplacementPlugin())
    plugins.push(new BundleAnalyzerPlugin({
      openAnalyzer: false
    }))
  }

  if (isProd) {
    plugins.push(new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: true
    }))
    plugins.push(new CopyPlugin({
      patterns: [
        { from: paths.locales, to: paths.buildLocales },
        { from: paths.favicon, to: paths.build },
        { from: 'public/robots.txt', to: paths.build, noErrorOnMissing: true },
        { from: 'public/sitemap.xml', to: paths.build, noErrorOnMissing: true },
        { from: paths.assets, to: paths.buildAssets },
        { from: 'public/docs', to: 'docs', noErrorOnMissing: true }
      ]
    }))
    plugins.push(new PrerendererWebpackPlugin({
      routes: ['/', '/voice-assistants', '/speech-analytics', '/pricing'],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'seo-render-ready',
        timeout: 30000,
        headless: true,
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          ...(process.env.PUPPETEER_EXECUTABLE_PATH
            ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
            : {})
        }
      },
      postProcess (renderedRoute: { html: string }) {
        const siteUrl = process.env.SITE_URL || 'https://aipbx.net'
        renderedRoute.html = renderedRoute.html
          .replace(/http:\/\/localhost:\d+/g, siteUrl)
      }
    }))
  }

  return plugins
}
