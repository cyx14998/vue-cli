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
            args[0].title = "终端管理";
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
        port: '8181',
        hot: true,
        proxy: {
            "/api/": {
                // target: "http://192.168.212.154:8080", // 祥辉本地
                target: "https://crmdc.mysteelcms.com", //
                changeOrigin: true, //开启跨域
            },
            "/databrowser-api/": {
                // target: "http://192.168.202.5:8080", // 测试地址
                // target: "http://192.168.212.161:8080", // 道江本地
                // target: "http://192.168.212.154:8080", // 祥辉本地
                target: "https://crmdc.mysteelcms.com", //
                changeOrigin: true, //开启跨域
                // pathRewrite: {
                //     '/databrowser-api/': '/'
                // }
            },
        }
    },
}
