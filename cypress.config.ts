import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    API_URL: 'http://localhost:5005/api',
  },
  e2e: {
    setupNodeEvents (on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000'
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
})
