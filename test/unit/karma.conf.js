var webpackConfig = require('../../webpack.test.config.js');
var webpack = require('webpack');
var path = require('path');

module.exports = function(config) {
    var configuration = {
        // to run in additional browsers:
        // 1. install corresponding karma launcher
        //    http://karma-runner.github.io/0.13/config/browsers.html
        // 2. add it to the `browsers` array below.
        browsers: ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        frameworks: ['mocha', 'sinon-chai'],
        // 增加代码覆盖率输出插件
        reporters: ['spec', 'coverage-istanbul'],
        files: ['./index.js'],
        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        // 配置代码覆盖率插件
        coverageIstanbulReporter: {
            // 以什么格式, 这里设置了输出 html文件 ,info文件 ,及控制台
            reports: ['html', 'lcovonly', 'text-summary'],
            // 将文件输出路径定位
            dir: path.join(__dirname, './coverage'),
            // 修正 weback 路径（翻译了是这个意思）
            fixWebpackSourcePaths: true,
            // 将生成的html放到./coverage/html/下
            'report-config': {
                html: {
                    subdir: 'html'
                }
            }
        },
        client: {
            mocha: {
                timeout: 4000
            }
        }
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }

    config.set(configuration);
};
