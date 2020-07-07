const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
    alias: {
      // "@ag-grid-community/core/modules": path.resolve('./node_modules/@ag-grid-community/core/dist/es2015/modules'),
      '@ag-grid-community/core': path.resolve(
        './node_modules/@ag-grid-community/core'
      ),
      // "ag-grid-enterprise": path.resolve('./node_modules/ag-grid-enterprise'),
      '@ace-builds': path.resolve('./node_modules/@ace-builds'),
      react: path.resolve('./node_modules/react'),
    },
  },
  entry: './src/app.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      { test: /\.svg$/, loader: 'file-loader' },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/renderer'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4000,
    publicPath: '/',
  },
  output: {
    path: path.resolve(__dirname, './dist/renderer'),
    filename: 'js/[name].js',
    publicPath: './',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dynectron',
    }),
    new webpack.ExternalsPlugin('commonjs', ['electron']),
  ],
};
