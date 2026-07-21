declare module '*.scss' {
  type IClassNames = Record<string, string>
  const classNames: IClassNames
  export = classNames
}

declare module '*.module.scss' {
  type IClassNames = Record<string, string>
  const classNames: IClassNames
  export = classNames
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg' {
  import type React from 'react'
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

declare const __IS_DEV__: boolean
declare const __API__: string
declare const __WS__: string
declare const __PROJECT__: 'storybook' | 'frontend' | 'jest'
declare const __STATIC__: string
declare const __GOOGLE_CLIENT_ID__: string
declare const __TG_BOT_ID__: string
declare const __STRIPE_PUBLISHABLE_KEY__: string
declare const __SENTRY_DSN__: string
declare const __SENTRY_ENVIRONMENT__: string
declare const __YANDEX_METRIKA_ID__: string
declare const __GA4_MEASUREMENT_ID__: string
declare const __SITE_URL__: string
declare const __GOOGLE_ADS_ID__: string
declare const __ADS_SIGNUP_LABEL__: string

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T
}
