/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:17:14 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-30 18:46:07
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    mode:    'development',
    entry:   [
        // 'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(__dirname, '../src/web/index'),
    ],
    output: {
        path:       path.join(__dirname, '../src/web'),
        filename:   'bundle.js',
        publicPath: '/',
    },
    performance: {
        hints: false
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
                    plugins: [
                        [
                            'react-transform',
                            {
                                transforms: [
                                    {
                                        transform: 'react-transform-hmr',
                                        imports:   ['react'],
                                        // this is important for Webpack HMR:
                                        locals:    ['module'],
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV:     JSON.stringify('development'),
                PLATFORM_ENV: JSON.stringify('web'),
            },
            '__DEV__': true,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    devServer: {
        inline:             true,
        port:               3000,
        host:               '0.0.0.0',
        historyApiFallback: true,
    }
};
