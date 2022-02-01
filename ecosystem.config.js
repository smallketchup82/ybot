/* eslint-disable */
module.exports = {
    apps : [{
      name: 'ybot',
      script: './index.js',
      watch: false,
      ignore_watch: ["data", "node_modules"],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }],
  }
  