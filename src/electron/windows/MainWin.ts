import { BrowserWindow, ipcMain } from 'electron'
import App from '../App'

export class MainWin extends BrowserWindow {
  app: App
  after: (() => void) | null = null
  constructor(app: App, after?: () => void) {
    super({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
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
    this.on('close', (event) => {
      this.hide()
      this.setSkipTaskbar(true)
      event.preventDefault()
    })
    this.on('closed', () => {
      this.app.mainWin = null
    })
    this.loadURL(`${this.app.indexUrl}/#/home`).then(() => {
      // this.webContents.openDevTools()
      if (this.after) {
        this.after()
      }
    })
  }
}
