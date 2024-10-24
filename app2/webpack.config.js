const { UniversalFederationPlugin } = require('@module-federation/node');
const webpack = require('webpack');
const path = require("path");
module.exports = {
  entry: ['./index.js', 'webpack/hot/poll?1000'],
  mode: 'development',
  target: 'async-node',
  output: {
    publicPath: 'http://localhost:3002/',
    library: { type: 'commonjs-module' },
    filename: '[name]-[contenthash].js',
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    hot: true,
    port: 3002,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new UniversalFederationPlugin({
      remoteType: 'script',
      isServer: true,
      name: 'app2',
      useRuntimePlugin: true,
      library: { type: 'commonjs-module' },
      filename: 'remoteEntry.js',
      exposes: {
        './sample': './expose-sample.js',
      },
    }),
  ],
};
