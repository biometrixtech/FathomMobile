const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
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
                loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version!sass-loader',
            },
            {
                test:   /\.json$/,
                loader: 'json-loader',
            },
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                loader:  'babel-loader',
                query:   {
                    presets: ['es2015', 'react', 'stage-0'],
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
                NODE_ENV:     JSON.stringify('DEV'),
                PLATFORM_ENV: JSON.stringify('web'),
            },
            '__DEV__': true,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
};
