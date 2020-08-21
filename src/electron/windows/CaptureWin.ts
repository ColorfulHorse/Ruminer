import { BrowserWindow } from 'electron'
import App from '../App'
export class CaptureWin extends BrowserWindow {
  app: App
  constructor(app: App) {
    super({
      maximizable: true,
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
    this.on('closed', () => {
      this.app.captureWin = null
    })
    this.loadURL(this.app.indexUrl + '/#/overlay').then(() => {
      // this.webContents.openDevTools()
    })
  }
}
