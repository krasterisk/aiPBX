import type webpack from 'webpack'
import { buildWebpackConfig } from './config/build/buildWebpackConfig'
import { type buildEnv, type buildPaths } from './config/build/types/config'
import path from 'path'

export default (env: buildEnv) => {
  const paths: buildPaths = {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    build: path.resolve(__dirname, 'build'),
    html: path.resolve(__dirname, 'public', 'index.html'),
    src: path.resolve(__dirname, 'src'),
    locales: path.resolve(__dirname, 'public', 'locales'),
    buildLocales: path.resolve(__dirname, 'build', 'locales')
  }

  const mode = env?.mode || 'development'
  const isDev = mode === 'development'
  const PORT = env?.port || 3000
  const apiUrl = env?.apiUrl || 'http://192.168.2.37:5005/api'
  const wsUrl = env?.wsUrl || 'ws://192.168.2.37:3033'

  const config: webpack.Configuration = buildWebpackConfig({
    mode,
    isDev,
    paths,
    port: PORT,
    apiUrl,
    wsUrl,
    project: 'frontend'
  })

  return config
}
