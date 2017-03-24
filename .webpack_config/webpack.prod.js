var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var path = require('path');
var root = path.resolve(__dirname);

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',
    output: {
        path: root+ '/../public/Content',
        filename: '[name].min.js'
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
});
