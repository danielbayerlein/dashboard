const Dotenv = require('dotenv-webpack')

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new Dotenv({ path: './.env' })
    )

    // For the development version, we'll use React.
    // Because, it support react hot loading and so on.
    if (!dev) {
      config.resolve.alias = {
        react: 'preact-compat/dist/preact-compat',
        'react-dom': 'preact-compat/dist/preact-compat'
      }
    }

    return config
  }
}
