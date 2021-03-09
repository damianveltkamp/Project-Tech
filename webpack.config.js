const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [__dirname + '/source/main.js', __dirname + '/source/main.scss'],
  output: {
    path: path.resolve(__dirname, 'static/build'),
    filename: 'js/main.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'css/', name: '[name].min.css' },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'source/components'),
      '@sass': path.resolve(__dirname, 'source/sass'),
      '@javascript': path.resolve(__dirname, 'source/javascript'),
    },
  },
};
