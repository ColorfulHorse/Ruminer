import { BrowserWindow, ipcMain } from 'electron'
import { App } from '../App'

export class MainWin extends BrowserWindow {
  app: App
  constructor(app: App) {
      super({
          width: 800,
          height: 600,
          maximizable: false,
          webPreferences: {
              nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION)
          }
      })
    this.app = app
    this.init()
  }

  init() {
    this.on('close', (event) => {
      this.hide()
      this.setSkipTaskbar(true)
      event.preventDefault()
      this.app.mainWin = null
    })
    this.loadURL(this.app.indexUrl)
    this.webContents.openDevTools()
  }
}