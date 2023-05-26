const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PORT = 3000;

/* Плагин для работы с HTML файлами */
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'index.html'),
  filename: 'index.html',
});

/* Удаление старых файлов после build в выходном папке */
const fileManagerWebpackPlugin = new FileManagerWebpackPlugin({
  events: {
    onStart: { delete: ['build'] },
  },
});

/* Плагин для хэширования css(отделения css от скрипта в точке выхода) */
const miniCssExtractPlugin = new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' });

/* CSS-loader подключили css */
const cssLoader = {
  test: /\.(css|sass|scss)$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
};

const cssModuleLoader = {
  test: /\.module\.(css|sass|scss)$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: { importLoaders: 1, modules: true },
    },
    'postcss-loader',
    'sass-loader',
  ],
};

/* TS-loader подключили ts */
const tsLoader = {
  test: /\.(ts|tsx)$/,
  exclude: /node_modules/,
  use: 'ts-loader',
};

/* BABEL-loader подключили babel */
const babelLoader = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
  },
};

/* Работа с картинками */
const assetsLoader = {
  test: /\.(png|jpg|jpeg|gif|svg)$/i,
  type: 'asset/resource',
};

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [htmlWebpackPlugin, fileManagerWebpackPlugin, miniCssExtractPlugin],
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: PORT,
    historyApiFallback: true,
  },
  entry: path.join(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [tsLoader, babelLoader, cssModuleLoader, cssLoader, assetsLoader],
  },
};
