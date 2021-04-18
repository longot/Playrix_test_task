const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
  target: ['web', 'es5'],
  entry: './src/index.js',
  output: {
    pathinfo: true,
    filename: '[name].js',
    path: './build',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }, {
        test: /\.(mp3|gif|png|jpe?g|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      }, {
        test: /p2\.js/,
        loader: 'expose-loader',
        options: {
          exposes: ['p2'],
        },
      }, {
        test: /pixi\.js/,
        loader: 'expose-loader',
        options: {
          exposes: ['PIXI'],
        },
      }, {
        test: /phaser-split\.js$/,
        loader: 'expose-loader',
        options: {
          exposes: ['Phaser'],
        },
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'assets': path.join(__dirname, 'assets/'),
    },
  },
  stats: 'minimal',
  devtool: 'source-map',
  performance: {
    hints: false,
  },
  devServer: {
    port: 8080,
    stats: 'minimal',
  },
}
