/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import path from 'path'

export default {
  globals: {
    __IS_DEV__: true,
    __API__: '',
    __WS__: '',
    __PROJECT__: 'jest',
    __STATIC__: '',
    __GOOGLE_CLIENT_ID__: '',
    __TG_BOT_ID__: '',
    __STRIPE_PUBLISHABLE_KEY__: '',
    __SENTRY_DSN__: '',
    __SENTRY_ENVIRONMENT__: 'test',
    __YANDEX_METRIKA_ID__: '',
    __GA4_MEASUREMENT_ID__: ''
  },
  clearMocks: true,
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: [
    '\\\\node_modules\\\\'
  ],
  moduleFileExtensions: [
    'js',
    'mjs',
    'cjs',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  rootDir: '../../',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>src/**/*(*.)@(spec|test).[tj]s?(x)'
  ],
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>config/jest/jest-setup.ts'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.svg': path.resolve(__dirname, 'jestEmptyComponent.tsx'),
    '@/(.*)': '<rootDir>/src/$1'
  },
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: '<rootDir>/reports/unit',
      filename: 'report.html',
      openReport: false,
      inlineSource: true
    }]
  ]
}
