import App from '@/electron/App'
import { BrowserWindow, ipcMain, Rectangle, screen } from 'electron'
import IWin from '@/electron/windows/IWin'
import log from 'electron-log'
import IPC from '@/electron/event/IPC'
import conf from '@/config/Conf'
import * as ref from 'ref-napi'
import { DModel as M, DStruct, U, DTypes as T } from 'win32-api'
import { Struct, windowsApi } from '@/electron/ffi/WindowsApi'

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
      alwaysOnTop: true,
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
