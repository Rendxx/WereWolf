const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractTextPlugin = new ExtractTextPlugin("./[name].css");
const LessPluginAutoPrefix = require("less-plugin-autoprefix");
const lessPluginAutoPrefix = new LessPluginAutoPrefix();
const root = path.resolve(__dirname);


var styleUrlOptions = {
    limit: 10000,                 //embed up to 10k size image file into css as data url
    emitFile: true,              //do not copy file larger than 10k
    context: root,
    name: '../Image/[hash].[ext]'    //keep the original filename for those larger than 10k
};

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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                //strictMath: true, strictUnits: true,
                plugins: [
                  lessPluginAutoPrefix
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        use: { loader: 'url-loader', options: styleUrlOptions }
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        exclude: /node_modules/,
        use: ['file-loader?name=../Font/[name].[ext]']
      },
      {
        test: /\.mp3$/,
        exclude: /node_modules/,
        use: ['file-loader?name=../Sound/[name].[ext]']
      }
    ]
  },
  resolve: {
    alias: {
      SRC: root + '/../src',
      CLIENT: root + '/../src/client',
      HOST: root + '/../src/host',
      GLOBAL: root + '/../src/global',
      CHARACTER: root + '/../src/Character',
      PHASE: root + '/../src/Phase',
    },
    extensions: ['.js', '.json', '.less']
  }
};
