import { ContentWin } from './windows/ContentWin'

import { app, BrowserWindow, globalShortcut, ipcMain, Menu, protocol, dialog, Notification, Tray } from 'electron'
import { createProtocol, } from 'vue-cli-plugin-electron-builder/lib'
import { HotKeys, IPC } from '@/constant/Constants'
import { MainWin } from './windows/MainWin'
import { CaptureWin } from './windows/CaptureWin'
import { Rect } from '@/graphics/Graphics'
import path from 'path'
import log from 'electron-log'
import conf, { HotKey, HotKeyConf } from '@/config/Conf'
import store from '@/store/index'
import HotKeyUtil from '@/utils/HotKeyUtil'
import CommonUtil from '@/utils/CommonUtil'

'use strict'
declare const __static: string
export default class App {
  isDevelopment = process.env.NODE_ENV !== 'production'
  indexUrl: string = ''
  tray: Tray | null = null
  mainWin: MainWin | null = null
  captureWin: CaptureWin | null = null
  contentWin: ContentWin | null = null
  openDevTools = false


  constructor() {
    protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])
    this.init().then(() => {
      Menu.setApplicationMenu(null)
      this.initTray()
      this.initHotKey()
      this.initIpc()
      this.initMain()
      // this.initContent()
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

    app.on('will-quit', () => {
      // 注销所有快捷键
      globalShortcut.unregisterAll()
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
    const keys = Object.keys(store.state.hotkey) as Array<keyof HotKeyConf>
    const ok = keys.map(value => {
      let hotkey = conf.hotkey.get(value)
      const oldValid = hotkey.valid
      hotkey = HotKeyUtil.register(hotkey, this)
      if (oldValid !== hotkey.valid) {
        if (this.mainWin != null) {
          // 更新快捷键状态
          this.mainWin.webContents.send(IPC.HOTKEY_INVALID, hotkey)
        }
      }
      return hotkey.valid
    }).reduce((prev, curr) => {
      return prev && curr
    })
    if (!ok) {
      const notification = new Notification({
        title: '快捷键冲突',
        body: '部分快捷键冲突，请重新设置',
        silent: false,
        timeoutType: 'default'
      })
      notification.show()
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
          this.showMain()
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
      log.info(IPC.OPEN_DEVTOOL)
      const focus = BrowserWindow.getFocusedWindow()
      if (focus != null) {
        log.info(focus.id)
        focus.webContents.openDevTools()
      }
    })

    ipcMain.on(IPC.MAIN_LOG, (event, ...args: any[]) => {
      log.info(args)
    })

    ipcMain.on(IPC.SELECT_AREA, () => {
      this.showOverlay()
    })

    ipcMain.on(IPC.SELECT_WINDOW, () => {
      // if (this.mainWin != null) {
      //   dialog.showMessageBox(this.mainWin, {
      //     type: 'warning',
      //     message: '快捷键冲突'
      //   })
      // }
      // app.on('browser-window-focus', (event: Event, window: BrowserWindow) => {
      //   log.info(`窗口名${window.getTitle()}`)
      // })
      // const current = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
      // const win = screen.getDisplayNearestPoint({x: 0, y: 0})
      // log.info(`窗口名${win.id}`)
      // log.info(`当前窗口名${current.id}`)
    })
    // app.on('browser-window-focus', (event: Event, window: BrowserWindow) => {
    //   log.info(`当前窗口名${window.getTitle()}`)g
    // })

    ipcMain.on(IPC.CLOSE_OVERLAY, () => {
      this.showContent()
    })

    ipcMain.on(IPC.OPEN_CONTENT, () => {
      this.showContent()
    })
    ipcMain.on(IPC.CLOSE_CONTENT, () => {
      if (this.contentWin != null) {
        this.contentWin.close()
      }
    })

    ipcMain.handle(IPC.CHANGE_HOTKEY, async (event, hotkey: HotKey) => {
      // 更改快捷键
      return HotKeyUtil.register(hotkey, this)
    })

    // 锁定窗口大小
    ipcMain.on(IPC.LOCK_CONTENT, () => {
      if (this.contentWin != null) {
        this.contentWin.setFocusable(false)
        // this.contentWin.blur()
      }
    })
  }

  showMain() {
    if (this.mainWin != null) {
      if (this.mainWin.isMinimized()) this.mainWin.restore()
      this.mainWin.show()
      this.mainWin.focus()
    }
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
      this.mainWin = new MainWin(this, () => {
        this.showContent()
      })
    }
  }

  /**
   * 显示文字窗口
   */
  showContent() {
    if (this.captureWin != null) {
      this.captureWin.close()
    }
    if (CommonUtil.checkConfig(this)) {
      if (this.contentWin == null) {
        this.contentWin = new ContentWin(this)
      }
      // macOS
      // app.dock.hide()
      // this.contentWin.setVisibleOnAllWorkspaces(true)
      this.contentWin.setAlwaysOnTop(true, 'screen-saver', 999)
      this.contentWin.show()
    }
  }

  showOverlay() {
    if (this.contentWin != null) {
      this.contentWin.setAlwaysOnTop(false)
    }
    if (this.captureWin == null) {
      this.captureWin = new CaptureWin(this)
    }
  }
}
