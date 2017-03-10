var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractTextPlugin = new ExtractTextPlugin("./[name].css");
var root = path.resolve(__dirname);

module.exports = {
  plugins: [
    extractTextPlugin
  ],
  entry: {
    host: './src/host/Wrap',
    client: './src/client/Wrap',
    test: './src/test/Wrap'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ['style-loader','css-loader','less-loader']
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        use: ['url-loader']
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        exclude: /node_modules/,
        use: ['file-loader?name=../Font/[name].[ext]']
      }
    ]
  },
  resolve: {
    alias: {
      CLIENT: root + '/../src/client',
      HOST: root + '/../src/host',
      GLOBAL: root + '/../src/global',
    },
    extensions: ['.js', '.json', '.less']
  }
};
