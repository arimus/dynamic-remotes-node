const { UniversalFederationPlugin } = require('@module-federation/node');
const webpack = require('webpack');

module.exports = {
  entry: ['./index.js', 'webpack/hot/poll?1000'],
  mode: 'development',
  target: 'async-node',
  externals: [],
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
