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
    buildLocales: path.resolve(__dirname, 'build', 'locales'),
    favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
    assets: path.resolve(__dirname, 'public', 'assets'),
    buildAssets: path.resolve(__dirname, 'build', 'assets')
  }

  const mode = env?.mode || 'development'
  const isDev = mode === 'development'
  const PORT = env?.port || 3000
  const apiUrl = env?.apiUrl || 'http://192.168.2.37:5005/api'
  const wsUrl = env?.wsUrl || ''
  const staticUrl = env?.staticUrl || 'http://192.168.2.37:5005/static'
  const googleClientId = env?.googleClientId || '833962533381-ehqsn7soc4s9e82cv9ats589787ihrog.apps.googleusercontent.com'
  const tgBotId = env?.tgBotId || '8298793342'
  const stripePublishableKey = env?.stripePublishableKey || 'pk_test_51SraxrIPIiX1aE70WbOwZQhPPjDvHQELzJQ8WbgZOMomPve8AxQlFgczq9qT2QQhCwgZDPbtiBZ4eFdtOSWuiZC200kLK9XSQ0'

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
    stripePublishableKey
  })
}
