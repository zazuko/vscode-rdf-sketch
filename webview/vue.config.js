const path = require('path')

const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,

  filenameHashing: false,
  outputDir: path.resolve(__dirname, '../media'),

  configureWebpack: config => {
    // Webpack 5 doesn't provide polyfills so we need to do it manually
    config.resolve.fallback = {
      crypto: false,
      stream: require.resolve('stream-browserify'),
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    )
  },
})
