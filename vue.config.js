const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'www.corho.com',
    hot: true,
    port: 8080,
    allowedHosts: 'all',
    historyApiFallback: true,
    // 其他有价值的配置项
    https: false,
    open: true // 帮我们打开浏览器
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
    // devServer: {
    //   host: 'www.corho.com',
    //   hot: true,
    //   port: 8080,
    //   allowedHosts: 'all',
    //   historyApiFallback: true,
    //   // 其他有价值的配置项
    //   disableHostCheck: true,
    //   https: false,
    //   open: true // 帮我们打开浏览器
    // }

    // 这个是给webpack-dev-server开启可IP和域名访问权限。
    // chainWebpack: (config) => {
    //   config.devServer.disableHostCheck(true)
    // }
    // 配置开发服务器
    // server: {
    //   // QQ三方登录的回调uri为：http://www.corho.com:8080/#/login/callback
    //   // vite 中配置： www.corho.com:8080
    //   host: 'www.corho.com',
    //   port: 8080,
    //   // 其他有价值的配置项
    //   open: true // 帮我们打开浏览器
    // }
  }
})
