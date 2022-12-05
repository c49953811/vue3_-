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
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
    // 这个是给webpack-dev-server开启可IP和域名访问权限。
    // chainWebpack: (config) => {
    //   config.devServer.disableHostCheck(true)
    // }
  }
})
