import App from '@/electron/App'
import { BrowserWindow } from "electron"
import IWin from '@/electron/windows/IWin'
import log from 'electron-log'
import { IPC } from '@/constant/Constants'

export default class SelectWin implements IWin{
  app: App
  win: BrowserWindow

  constructor(app: App, sources: string) {
    this.app = app
    this.win = new BrowserWindow({
      maximizable: false,
      frame: false,
      width: 250,
      height: 250,
      // resizable: false,
      movable: true,
      center: true,
      // 隐藏任务栏图标
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
        nodeIntegrationInWorker: true,
        additionalArguments: Array.of(sources),
      },
      show: false
    })
    this.init()
  }

  init() {
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
