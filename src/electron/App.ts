'use strict'

import { app, protocol, Menu, Tray, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import { IPC } from '../constant/Constants'
import { MainWin } from './windows/MainWin'
import { CaptureWin } from './windows/CaptureWin'

export class App {
  isDevelopment = process.env.NODE_ENV !== 'production'
  indexUrl: string = ''
  mainWin: MainWin | null = null
  captureWin: CaptureWin | null = null

  constructor() {
    protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])
    this.init().then(() => {
      Menu.setApplicationMenu(null)
      this.initIpc()
      this.initMain()
    })
  }

  init() {
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      this.indexUrl = process.env.WEBPACK_DEV_SERVER_URL as string
    } else {
      createProtocol('app')
      this.indexUrl = 'app://./index.html'
    }
    if (this.isDevelopment) {
      if (process.platform === 'win32') {
        process.on('message', data => {
          if (data === 'graceful-exit') {
            app.quit()
          }
        })
      } else {
        process.on('SIGTERM', () => {
          app.quit()
        })
      }
    }
    app.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (this.mainWin === null) {
        this.mainWin = new MainWin(this)
      }
    })
    return app.whenReady()
  }

  /**
   * 监听渲染进程
   */
  private initIpc() {
    // 打开调试
    ipcMain.on(IPC.OPEN_DEVTOOL, () => {
      const focused = BrowserWindow.getFocusedWindow()
      if (focused != null) {
        focused.webContents.openDevTools()
      }
    })

    ipcMain.on(IPC.SELECT_AREA, () => {
      if (this.captureWin == null) {
        this.captureWin = new CaptureWin(this)
      }
    })

    ipcMain.on(IPC.CLOSE_OVERLAY, () => {
      if (this.captureWin != null) {
        this.captureWin.close()
      }
    })
  }

  /**
   * 主窗口
   */
  private initMain() {
    if (this.isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      // Devtools extensions are broken in Electron 6.0.0 and greater
      // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
      // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
      // If you are not using Windows 10 dark mode, you may uncomment these lines
      // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
      // try {
      //   await installVueDevtools()
      // } catch (e) {
      //   console.error('Vue Devtools failed to install:', e.toString())
      // }
    }
    if (this.mainWin === null) {
      this.mainWin = new MainWin(this)
    }
  }
}