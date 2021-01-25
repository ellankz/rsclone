const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => ({
  mode: env.production ? 'production' : 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    open: true,
  },

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({ filename: 'main.[contenthash].css', insert: '#styles' }),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: 'src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
  ],

  module: {
    rules: [{
      test: /\.(png|jpe?g|gif|xml|svg|webmanifest|ico)$/i,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
        outputPath: (file) => {
          const imagesPath = file.split('src/')[1];
          return imagesPath;
        },
      },
    },
    {
      test: /\.(mp3|wav)$/i,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
        outputPath: (file) => {
          const filePath = file.split('src/')[1];
          return filePath;
        },
      },
    }, {
      test: /\.(ts|tsx)$/,
      loader: 'babel-loader',
      exclude: [/node_modules/],
    }, {
      test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
      type: 'asset/inline',
    }, {
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [path.resolve(__dirname, 'src')],
      exclude: [/node_modules/],
    }, {
      test: /.(scss|css)$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      }],
    }],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },
});
