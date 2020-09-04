import { BrowserWindow, ipcMain } from 'electron'
import App from '../App'
import IWin from '@/electron/windows/IWin'

export class MainWin implements IWin {
  app: App
  win: BrowserWindow
  after: (() => void) | null = null
  constructor(app: App, after?: () => void) {
    this.win = new BrowserWindow({
      width: 800,
      height: 500,
      vibrancy: 'ultra-dark',
      backgroundColor: '#3f3c37',
      frame: false,
      show: false,
      resizable: false,
      minimizable: true,
      icon: `${__static}/logo.png`,
      webPreferences: {
        nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
        enableRemoteModule: true
      }
    })
    if (after) {
      this.after = after
    }
    this.app = app
    this.init()
  }

  init() {
    this.win.on('closed', () => {
      this.app.mainWin = null
    })
    this.win.on('ready-to-show', () => {
      this.win.show()
      this.win.focus()
    })
    this.win.loadURL(`${this.app.indexUrl}`).then(() => {
      if (this.app.openDevTools) {
        this.win.webContents.openDevTools()
      }
      if (this.after) {
        this.after()
      }
    })
  }
}
