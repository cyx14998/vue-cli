const debug = process.env.NODE_ENV !== 'production'
const path = require('path')
module.exports = {
    configureWebpack: config => {
        if (debug) { // 开发环境配置
            config.devtool = 'source-map'
        }
    },

    outputDir: 'dist',
    lintOnSave: false,

    devServer: {
        overlay: {
            warning: false,
            errors: false
        },
        port: '8081',
        proxy: {
            "/graphs_api": {
                target: "https://crmdc.mysteelcms.com/", //生产
                changeOrigin: true, //开启跨域
            }
        }
    },
}
