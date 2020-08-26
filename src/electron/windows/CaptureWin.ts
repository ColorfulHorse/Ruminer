import { BrowserWindow } from 'electron'
import App from '../App'
export class CaptureWin {
  app: App
  win: BrowserWindow
  constructor(app: App) {
    this.win = new BrowserWindow({
      maximizable: false,
      resizable: false,
      fullscreen: true,
      frame: false,
      transparent: true,
      skipTaskbar: true,
      focusable: true,
      webPreferences: {
        nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION)
      }
    })
    this.app = app
    this.init()
  }

  init() {
    this.win.on('closed', () => {
      this.app.captureWin = null
    })
    this.win.loadURL(this.app.indexUrl + '/#/overlay').then(() => {
      // this.webContents.openDevTools()
    })
  }
}
