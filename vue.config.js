const debug = process.env.NODE_ENV !== 'production'
// const path = require('path')
module.exports = {
    configureWebpack: config => {
        if (debug) { // 开发环境配置
            config.devtool = 'source-map'
        }
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = "数据浏览器后台";
            return args;
        })
    },

    outputDir: 'dist',
    publicPath: './',
    lintOnSave: false,

    devServer: {
        overlay: {
            warning: false,
            errors: false
        },
        port: '8081',
        hot: true,
        proxy: {
            "/graphs_api": {
                target: "https://crmdc.mysteelcms.com/", //生产
                changeOrigin: true, //开启跨域
            },
            "/api/": {
                target: "http://192.168.212.154:8080", //生产
                changeOrigin: true, //开启跨域
            },
        }
    },
}
