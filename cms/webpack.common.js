const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name() {
              if (process.env.NODE_ENV === 'development') {
                return '[path][name].[ext]';
              }
              return '[contenthash].[ext]';
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@const': path.resolve(__dirname, 'src/const'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@common': path.resolve(__dirname, 'src/main/common'),
      '@components': path.resolve(__dirname, 'src/main/components'),
      '@containers': path.resolve(__dirname, 'src/main/containers'),
      '@models': path.resolve(__dirname, 'src/main/models'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@reducers': path.resolve(__dirname, 'src/main/reducers'),
      '@service': path.resolve(__dirname, 'src/service'),
      '@translations': path.resolve(__dirname, 'src/translations'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      baseUrl: '/',
      template: path.join(__dirname, 'public', 'index.html'),
      title: 'PMN CMS',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
};
