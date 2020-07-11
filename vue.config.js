module.exports = {
  devServer: {
    // can be overwritten by process.env.HOST
    host: '0.0.0.0',
    port: 8080
  },
  configureWebpack: {
    // externals: {
    //   'tesseract.js': 'Tesseract'
    // },
    devtool: 'source-map'
  },
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       colors: '@import "@/styles/_colors.scss";'
  //     }
  //   }
  // },
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
