const debug = process.env.NODE_ENV !== 'production'
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
    }
}