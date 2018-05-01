/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:17:20 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-30 13:17:45
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry:  [path.join(__dirname, '../src/web/index')],
    mode:   'production',
    output: {
        path:       path.join(__dirname, '../public/'),
        filename:   'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            // Take all sass files, compile them, and bundle them in with our js bundle
            {
                test:   /\.scss$/,
                loader: 'style-loader!css-loader!postcss-loader?browsers=last 2 version!sass-loader',
            },
            {
                test:   /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.(jpg|png|gif|svg|pdf|ico)$/,
                use:  [
                    {
                        loader:  'file-loader',
                        options: {
                            name: '[path][name]-[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                loader:  'babel-loader',
                query:   {
                    presets: ['env', 'react', 'stage-0'],
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                NODE_ENV:     JSON.stringify('production'),
                PLATFORM_ENV: JSON.stringify('web'),
            },
            '__DEV__': false,
        }),
        // optimizations
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        // }),
    ],
};
