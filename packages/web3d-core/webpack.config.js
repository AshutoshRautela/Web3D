const path = require('path');

const ROOT = path.resolve( __dirname);
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    entry: {
        'main': './index.ts'
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

