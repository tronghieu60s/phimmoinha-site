const path = require('path');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    open: false,
    historyApiFallback: true,
    static: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(
        dotenv.config({
          path: path.join(__dirname, 'env', '.env.dev'),
        }).parsed,
      ),
    }),
  ],
});
