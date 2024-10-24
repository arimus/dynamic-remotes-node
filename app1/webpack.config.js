const { UniversalFederationPlugin } = require('@module-federation/node');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['./index.js', 'webpack/hot/poll?1000'],
  mode: 'development',
  target: 'async-node',
  externals: [nodeExternals({ allowlist: ['webpack/hot/poll?1000'] })],
  output: {
    publicPath: 'http://localhost:3001/',
    library: { type: 'commonjs-module' },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new UniversalFederationPlugin({
      remoteType: 'script',
      isServer: true,
      name: 'app1',
      useRuntimePlugin: true,
      exposes: {
        './noop': './noop.js',
      },
    }),
  ],
};
