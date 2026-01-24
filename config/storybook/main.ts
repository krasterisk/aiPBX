// import type { StorybookConfig } from '@storybook/react-vite'
import type { StorybookConfig } from '@storybook/react-webpack5'
import { buildPaths } from '../build/types/config'
import path from 'path'
import { DefinePlugin, RuleSetRule } from 'webpack'
import { buildCssLoader } from '../build/loaders/buildCssLoader'
// import { buildCssLoader } from '../build/loaders/buildCssLoader'

const config: StorybookConfig = {
  stories: ['../../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false
      }
    },
    '@storybook/addon-interactions',
    'storybook-addon-mock',
    'storybook-addon-themes'
  ],
  features: {
    storyStoreV7: false
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  webpackFinal: async (config, { configType }) => {
    const paths: buildPaths = {
      build: '',
      html: '',
      entry: '',
      src: path.resolve(__dirname, '..', '..', 'src'),
      locales: path.resolve(__dirname, '..', '..', 'public', 'locales'),
      buildLocales: path.resolve(__dirname, '..', '..', 'build', 'locales'),
      favicon: path.resolve(__dirname, '..', '..', 'public', 'favicon.ico')
    }

    config.resolve!.modules!.push(paths.src)
    config.resolve!.extensions!.push('.ts', '.tsx')
    config.resolve!.alias = {
      ...config.resolve!.alias,
      '@': paths.src
    }

    // @ts-expect-error
    config.module!.rules = config.module!.rules!.map((rule: RuleSetRule) => {
      if (rule?.test instanceof RegExp && rule.test.toString().includes('svg')) {
        return {
          ...rule,
          exclude: /\.svg$/i
        }
      }

      return rule
    })

    config.module!.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    config.module!.rules.push(buildCssLoader(true))

    config.plugins!.push(new DefinePlugin({
      __IS_DEV__: JSON.stringify(true),
      __API__: JSON.stringify('https://localhost'),
      __PROJECT__: JSON.stringify('storybook')
    }))

    return config
  }
}
export default config
