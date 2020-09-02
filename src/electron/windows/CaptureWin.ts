import { BrowserWindow, Rectangle } from 'electron'
import App from '../App'
import { DModel as M } from 'win32-def'
export class CaptureWin {
  app: App
  win: BrowserWindow

  constructor(app: App, rect?: Rectangle) {
    if (!rect) {
      this.win = new BrowserWindow({
        maximizable: false,
        resizable: false,
        fullscreen: true,
        frame: false,
        transparent: true,
        show: false,
        skipTaskbar: true,
        focusable: true,
        webPreferences: {
          nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION)
        }
      })
    } else {
      this.win = new BrowserWindow({
        resizable: false,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        focusable: true,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        webPreferences: {
          nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION)
        }
      })
    }
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
