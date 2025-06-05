module.exports = {
  apps: [
    {
      name: 'aiPBX',
      script: './dist/main.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
