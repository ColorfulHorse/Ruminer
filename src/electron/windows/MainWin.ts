import { BrowserWindow, ipcMain } from 'electron'
import App from '../App'

export class MainWin {
  app: App
  win: BrowserWindow
  after: (() => void) | null = null
  constructor(app: App, after?: () => void) {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      maxWidth: 800,
      maxHeight: 600,
      maximizable: false,
      webPreferences: {
        nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION)
      }
    })
    if (after) {
      this.after = after
    }
    this.app = app
    this.init()
  }

  init() {
    this.win.on('close', (event) => {
      this.win.hide()
      this.win.setSkipTaskbar(true)
      event.preventDefault()
    })
    this.win.on('closed', () => {
      this.app.mainWin = null
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
