const path = require('path');

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
            },
            {
                test: /\.obj/,
                use: {
                    loader: path.resolve(__dirname, '../../loaders/webpack-obj-loader.js')
                }
            }
        ]
    },

    devtool: 'cheap-module-source-map',

    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        port: 9000,
        compress: true,
        hot: true,
    },
};

