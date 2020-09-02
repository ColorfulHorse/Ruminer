import { ContentWin } from './windows/ContentWin'

import { app, globalShortcut, Menu, Notification, protocol, Rectangle, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import IPC, { KEYS } from '@/electron/event/IPC'
import { MainWin } from './windows/MainWin'
import { CaptureWin } from './windows/CaptureWin'
import path from 'path'
import conf, { HotKeyConf } from '@/config/Conf'
import store from '@/store/index'
import HotKeyUtil from '@/utils/HotKeyUtil'
import CommonUtil from '@/utils/CommonUtil'
import SelectWin from '@/electron/windows/SelectWin'

'use strict'
declare const __static: string
export default class App {
  isDevelopment = process.env.NODE_ENV !== 'production'
  indexUrl = ''
  tray: Tray | null = null
  mainWin: MainWin | null = null
  captureWin: CaptureWin | null = null
  contentWin: ContentWin | null = null
  selectWin: SelectWin | null = null
  openDevTools = true

  constructor() {
    protocol.registerSchemesAsPrivileged([{ scheme: 'ruminer', privileges: { secure: true, standard: true } }])
    this.init().then(() => {
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        this.indexUrl = process.env.WEBPACK_DEV_SERVER_URL as string
      } else {
        createProtocol('ruminer')
        this.indexUrl = 'ruminer://./index.html'
      }
      Menu.setApplicationMenu(null)
      IPC.register(this)
      this.initMain()
      this.initTray()
      // this.initHotKey()
      // this.initContent()
    }).catch(err => {})
  }

  init() {
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
          this.mainWin.win.webContents.send(KEYS.HOTKEY_INVALID, hotkey)
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
        label: '主界面',
        click: () => {
          this.showMain()
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])
    this.tray.setContextMenu(menu)
    this.tray.on('double-click', () => {
      if (this.mainWin != null) {
        if (this.mainWin.win.isMinimized()) this.mainWin.win.restore()
        this.mainWin.win.show()
        this.mainWin.win.focus()
      }
    })
  }

  showMain() {
    if (this.mainWin != null) {
      if (this.mainWin.win.isMinimized()) this.mainWin.win.restore()
      this.mainWin.win.show()
      this.mainWin.win.focus()
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
        this.initHotKey()
      })
    }
  }

  /**
   * 显示文字窗口
   */
  showContent() {
    if (this.captureWin != null) {
      this.captureWin.win.close()
    }
    if (CommonUtil.checkConfig(this)) {
      if (this.contentWin == null) {
        this.contentWin = new ContentWin(this)
      }
      // macOS
      // app.dock.hide()
      // this.contentWin.win.setVisibleOnAllWorkspaces(true)
      this.contentWin.win.setAlwaysOnTop(true, 'screen-saver', 999)
      this.contentWin.win.show()
    }
  }

  showOverlay(rect?: Rectangle) {
    if (this.contentWin != null) {
      this.contentWin.win.setAlwaysOnTop(false)
    }
    if (this.captureWin == null) {
      this.captureWin = new CaptureWin(this, rect)
      this.captureWin.win.setAlwaysOnTop(true, 'pop-up-menu')
      this.captureWin.win.show()
    }
  }
}
