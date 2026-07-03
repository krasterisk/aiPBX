import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const apiUrl = process.env.API_URL ?? process.env.VITE_API_URL ?? 'http://localhost:5005/api'
const backendTarget = process.env.BACKEND_PROXY_TARGET ?? process.env.BACKEND_URL ?? 'http://localhost:5005'
const useRelativeApi = apiUrl.startsWith('/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({ exportAsDefault: true }),
    react()
  ],
  server: useRelativeApi
    ? {
        proxy: {
          '/api': { target: backendTarget, changeOrigin: true },
          '/static': { target: backendTarget, changeOrigin: true }
        }
      }
    : undefined,
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src'
      }
    ]
  },
  define: {
    __IS_DEV__: JSON.stringify(true),
    __API__: JSON.stringify(apiUrl),
    __PROJECT__: JSON.stringify('frontend')
  }
})
