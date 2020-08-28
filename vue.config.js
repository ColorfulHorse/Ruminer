const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/baidufanyi': {
        target: 'http://api.fanyi.baidu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/baidufanyi': ''
        }
      },
      '/baiduocr': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true,
        pathRewrite: {
          '^/baiduocr': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        prependData: '@import \'@/assets/styles/colors.scss\';'
      }
    }
  },
  configureWebpack: config => {
    // externals: {
    //   'tesseract.js': 'Tesseract'
    // },
    config.devtool = 'source-map'
    config.externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios'
    }
    // 服务器开启gzip
    // config.plugins.push(
    //   new CompressionWebpackPlugin({
    //     algorithm: 'gzip',
    //     test: new RegExp('\\.(" + productionGzipExtensions.join("|") + ")$'),
    //     threshold: 10240,
    //     minRatio: 0.8
    //   })
    // )
    // return {
    //   optimization: {
    //     splitChunks: {
    //       cacheGroups: {
    //         libs: {
    //           name: 'chunk-libs', // 只打包初始时依赖的第三方
    //           test: /[\\/]node_modules[\\/]/,
    //           priority: 10,
    //           chunks: 'initial'
    //         },
    //         elementUI: {
    //           name: 'chunk-elementUI', // 单独将 elementUI 拆包
    //           priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
    //           test: /[\\/]node_modules[\\/]element-ui[\\/]/,
    //           chunks: 'all'
    //         }
    //       }
    //     },
    //     runtimeChunk: true
    //   }
    // }
  },
  chainWebpack: config => {
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
      mainProcessTypeChecking: false, // Manua
      mainProcessWatch: ['src/electron/**/*.ts'],
      // externals: ['ref-napi', 'ffi-napi', 'vue', 'vue-router', 'element-ui', 'axios']
      externals: ['ref-napi', 'ffi-napi']
      // externals: {
      //   'ref-napi': 'ref-napi',
      //   'ffi-napi': 'ffi-napi',
      //   vue: 'Vue',
      //   'vue-router': 'VueRouter',
      //   'element-ui': 'ELEMENT',
      //   axios: 'axios'
      // }
    }
  }
}
