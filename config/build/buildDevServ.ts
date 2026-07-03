import { buildOptions } from './types/config'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'

const DEFAULT_BACKEND_TARGET = process.env.BACKEND_PROXY_TARGET ??
  process.env.BACKEND_URL ??
  'http://localhost:5005'

export function buildDevServ (options: buildOptions): DevServerConfiguration {
  const useRelativeApi = options.apiUrl.startsWith('/')

  return {
    port: options.port,
    open: true,
    historyApiFallback: true,
    hot: true,
    ...(useRelativeApi
      ? {
          proxy: [
            {
              context: ['/api', '/static'],
              target: DEFAULT_BACKEND_TARGET,
              changeOrigin: true
            }
          ]
        }
      : {})
  }
}
