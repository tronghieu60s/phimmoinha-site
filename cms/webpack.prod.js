const path = require('path');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(
        dotenv.config({
          path: path.join(__dirname, 'env', '.env.prod'),
        }).parsed,
      ),
    }),
  ],
});
