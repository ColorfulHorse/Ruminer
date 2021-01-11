import App from '@/electron/App'
import { BrowserWindow } from 'electron'
import IWin from '@/electron/windows/IWin'

export default class SelectWin implements IWin {
  app: App
  win: BrowserWindow

  constructor(app: App, sources: string) {
    this.app = app
    this.win = new BrowserWindow({
      maximizable: false,
      frame: false,
      width: 300,
      height: 250,
      resizable: false,
      movable: true,
      center: true,
      // 隐藏任务栏图标
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
        nodeIntegrationInWorker: true,
        additionalArguments: Array.of(sources),
        enableRemoteModule: true
      },
      show: false
    })
    this.init()
  }

  init() {
    this.win.on('ready-to-show', () => {
      this.win.setAlwaysOnTop(true, 'screen-saver', 999)
      this.win.show()
    })
    this.win.on('closed', () => {
      this.app.selectWin = null
    })
    this.win.loadURL(this.app.indexUrl + '/#/select').then(() => {
      if (this.app.openDevTools) {
        this.win.webContents.openDevTools()
      }
    })
  }
}
