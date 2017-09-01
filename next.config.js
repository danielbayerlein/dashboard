const Dotenv = require('dotenv-webpack')

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new Dotenv({ path: './.env' })
    )

    if (!dev) {
      config.resolve.alias = {
        react: 'preact-compat/dist/preact-compat',
        'react-dom': 'preact-compat/dist/preact-compat'
      }
    }

    return config
  }
}
