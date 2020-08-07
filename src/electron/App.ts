import { ContentWin } from './windows/ContentWin'

import { app, globalShortcut, ipcMain, Menu, protocol, Tray } from 'electron'
import { createProtocol, } from 'vue-cli-plugin-electron-builder/lib'
import { IPC } from '../constant/Constants'
import { MainWin } from './windows/MainWin'
import { CaptureWin } from './windows/CaptureWin'
import { Rect } from '../graphics/Graphics'
import path from 'path'
import log from 'electron-log'
import conf from '../config/Conf'

'use strict'
declare const __static: string
export class App {
  isDevelopment = process.env.NODE_ENV !== 'production'
  indexUrl: string = ''
  tray: Tray | null = null
  mainWin: MainWin | null = null
  captureWin: CaptureWin | null = null
  contentWin: ContentWin | null = null


  constructor() {
    protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])
    this.init().then(() => {
      Menu.setApplicationMenu(null)
      this.initTray()
      this.initHotKey()
      this.initIpc()
      this.initMain()
      this.initContent()
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
   * 注册快捷键
   */
  private initHotKey() {
    const capture: string = conf.hotkey.get('captureScreen')
    const state = globalShortcut.register(capture, () => {
      if (this.captureWin == null) {
        this.captureWin = new CaptureWin(this)
      }
    })
    if (!state) {
      // 快捷键已经被注册
      log.info('快捷键冲突')
    }
  }

  /**
   * 系统托盘
   */
  private initTray() {
    const url = path.join(__static, './tray/logo.png')
    this.tray = new Tray(url)
    const menu = Menu.buildFromTemplate([
      {
        label: '主界面', click: () => {
          if (this.mainWin != null) {
            if (this.mainWin.isMinimized()) this.mainWin.restore()
            this.mainWin.show()
            this.mainWin.focus()
          }
        }
      },
      {
        label: '退出', click: () => {
          if (this.contentWin != null) {
            this.contentWin.close()
          }
          app.quit()
        }
      }
    ])
    this.tray.setContextMenu(menu)
    this.tray.on('double-click', () => {
      if (this.mainWin != null) {
        if (this.mainWin.isMinimized()) this.mainWin.restore()
        this.mainWin.show()
        this.mainWin.focus()
      }
    })
  }

  /**
   * 监听渲染进程
   */
  private initIpc() {
    // 打开调试
    ipcMain.on(IPC.OPEN_DEVTOOL, () => {
      if (this.mainWin != null) {
        this.mainWin.webContents.openDevTools()
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

    ipcMain.on(IPC.OPEN_CONTENT, () => {
      if (this.captureWin != null) {
        this.captureWin.close()
      }
      if (this.contentWin == null) {
        this.contentWin = new ContentWin(this)
      }
    })
    ipcMain.on(IPC.CLOSE_CONTENT, () => {
      if (this.contentWin != null) {
        this.contentWin.close()
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

  /**
   * 文字窗口
   */
  private initContent() {
    log.info(conf.common.path)
    const rect: Rect | null = conf.common.get('captureRect')
    if (rect != null) {
      if (this.contentWin == null) {
        this.contentWin = new ContentWin(this)
      }
    }
  }
}
