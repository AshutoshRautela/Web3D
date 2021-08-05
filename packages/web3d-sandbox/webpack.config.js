const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'src',);
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    entry: {
        'main': './sandbox.ts'
    },
    
    output: {
        filename: '[name].bundle.js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.ts', '.js', '.glsl'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: [
            /****************
            * LOADERS
            *****************/
            {
                test: /\.ts$/,
                exclude: [ /node_modules/ ],
                use: 'ts-loader'
            }, 
            {
                test: /\.glsl/,
                exclude: [/node_modules/],
                use: 'webpack-glsl-loader'
            }
        ]
    },

    devtool: 'cheap-module-source-map',
};

