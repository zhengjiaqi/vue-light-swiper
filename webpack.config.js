var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var pkg = require('./package.json');
var banner = `${pkg.name} v${pkg.version}\n${pkg.description}\n${pkg.homepage}\n@author ${pkg.author}`;

module.exports = {
    entry: {
        'vue-swiper': path.join(__dirname, 'src/index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        library: 'VueSwiper',
        libraryTarget: 'umd',
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'less-loader'
                ]
            }
        ]
    }
};

if (process.env.NODE_ENV === 'dev') {
    module.exports.devtool = '#eval-source-map';
} else {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.BannerPlugin(banner)
    ]);
}