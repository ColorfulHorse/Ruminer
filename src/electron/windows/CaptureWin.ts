import { BrowserWindow, Rectangle } from 'electron'
import App from '../App'
import { DModel as M } from 'win32-def'
import IWin from '@/electron/windows/IWin'
export class CaptureWin implements IWin{
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
        webPreferences: {
          nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
          enableRemoteModule: true,
        }
      })
    } else {
      this.win = new BrowserWindow({
        maximizable: false,
        resizable: false,
        frame: false,
        transparent: true,
        show: false,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
          enableRemoteModule: true,
        },
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
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
