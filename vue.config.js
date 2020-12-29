const isDev = process.env.NODE_ENV !== 'production'
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: isDev,
  devServer: {
    host: '0.0.0.0',
    port: 8080
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        prependData: '@import \'@/assets/styles/common.scss\';'
      }
    }
  },
  configureWebpack: config => {
    // externals: {
    //   'tesseract.js': 'Tesseract'
    // },
    // config.plugins.push(
    //   new CopyWebpackPlugin([
    //     {
    //       from: resolve('src/native/winapi/build/Release/winapi.node'),
    //       to: path.join(__static, 'winapi.node')
    //     }
    //   ])
    // )
    config.devtool = 'source-map'
    // config.externals = {
    //   vue: 'Vue',
    //   'vue-router': 'VueRouter',
    //   'element-ui': 'ELEMENT',
    //   axios: 'axios'
    // }
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
    // config.module
    //   .rule('node')
    //   .test(/\.node$/)
    //   .use('node-loader')
    //   .loader('node-loader')
    //   .end()
    config.resolve.alias
      .set('root', resolve('./'))
    // if (isDev) {
    //   config
    //     .plugin('webpack-bundle-analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
      mainProcessTypeChecking: false, // Manua
      mainProcessWatch: ['src/electron/**/*.ts'],
      externals: [
        'ruminer',
        'winapi.node',
        'ref-napi',
        'ffi-napi',
        'iconv',
        'vue',
        'vue-router',
        'element-ui',
        'element-theme-chalk',
        'axios',
        'vuex'
      ],
      customFileProtocol: 'ruminer://./',
      // chainWebpackMainProcess: config => {
      //   config.module
      //     .rule('node')
      //     .test(/\.node$/)
      //     .use('node-loader')
      //     .loader('node-loader')
      //     .end()
      // },
      // chainWebpackRendererProcess: config => {
      //   config.module
      //     .rule('node')
      //     .test(/\.node$/)
      //     .use('node-loader')
      //     .loader('node-loader')
      //     .end()
      // },
      builderOptions: {
        productName: 'Ruminer',
        appId: 'com.greensun.ruminer',
        copyright: 'green sun',
        extraFiles: [
          {
            from: 'src/native/ocr/build/Release',
            to: '.'
          },
          // {
          //   from: 'src/native/ocr/libs',
          //   to: '.'
          // },
          {
            from: 'src/native/winapi/build/Release/winapi.node',
            to: '.'
          }
        ],
        nsis: {
          installerIcon: 'public/favicon.ico',
          installerHeader: 'public/logo.png',
          installerHeaderIcon: 'public/favicon.ico',
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          runAfterFinish: false
        },
        asar: true,
        win: {
          icon: 'public/favicon.ico'
        }
      }
    }
  }
}
