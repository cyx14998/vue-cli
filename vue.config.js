const debug = process.env.NODE_ENV !== 'production'
const path = require('path')
module.exports = {
    configureWebpack: config => {
        if (debug) { // 开发环境配置
            config.devtool = 'source-map'
        }
    },

    outputDir: 'dist',

    devServer: {
        port: '8081',
        proxy: {
            '/proxy': {
                target: 'http://api.qingyunke.com',   //代理接口
                changeOrigin: true,
                pathRewrite: {
                    '/proxy': '/'
                }
            }
        }
    },

    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [
            path.resolve(__dirname, './src/assets/common.less')
        ]
      }
    }
}
