'use strict';

const path = require('path');
const HtmlWebPackPluggin = require('html-webpack-plugin');
// const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    //context: path.resolve(__dirname),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        //publicPath: 'pathOrUrlWhenProductionBuild'
    },
    devServer: {
        contentBase: [
            path.resolve(__dirname,'src/css/bootstrap'),
            path.resolve(__dirname,'src/js/bootstrap'),
            path.resolve(__dirname,'src/js/jquery'),
        ],
        contentBasePublicPath: '/'
    },
    module: {
        rules: [
        ]
    },
    resolve: {
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebPackPluggin({
            template: 'src/index.html',
            inject: false
        }),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // })
    ]
};
