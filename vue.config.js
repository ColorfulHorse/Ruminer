module.exports = {
  devServer: {
    // can be overwritten by process.env.HOST
    host: '0.0.0.0',
    port: 8080
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
}
