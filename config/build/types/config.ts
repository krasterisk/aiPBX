
export type buildMode = 'production' | 'development'

export interface buildPaths {
  entry: string
  build: string
  html: string
  src: string
  locales: string
  buildLocales: string
}

export interface buildOptions {
  mode: buildMode
  paths: buildPaths
  isDev: boolean
  port: number
  apiUrl: string
  wsUrl: string
  project: 'storybook' | 'frontend' | 'jest'
}

export interface buildEnv {
  mode: buildMode
  port: number
  apiUrl: string
  wsUrl: string
}
