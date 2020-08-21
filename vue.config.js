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
  configureWebpack: {
    // externals: {
    //   'tesseract.js': 'Tesseract'
    // },
    devtool: 'source-map'
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
      mainProcessTypeChecking: false, // Manua
      mainProcessWatch: ['src/electron/**/*.ts']
      // externals: ['tesseract.js']
    }
  }
}
