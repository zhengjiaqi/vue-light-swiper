// This is the webpack config used for unit tests.
var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.config')

var webpackConfig = merge(baseConfig, {
    // use inline sourcemap for karma-sourcemap-loader
    devtool: '#inline-source-map',
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            // necessary to to make lang="scss" work in test when using vue-loader's ?inject option
            // see discussion at https://github.com/vuejs/vue-loader/issues/724
            'scss-loader': 'sass-loader'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'post',
                exclude: /node_modules|utils\/popper\.js|utils\/date.\js/,
                include: path.resolve(__dirname, './src'),
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"testing"'
            }
        })
    ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig
