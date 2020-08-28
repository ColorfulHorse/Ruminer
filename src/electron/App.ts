import { ContentWin } from './windows/ContentWin'

import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Notification, protocol, Tray, screen, Rectangle, DesktopCapturerSource } from 'electron'
import { createProtocol, } from 'vue-cli-plugin-electron-builder/lib'
import { IPC } from '@/constant/Constants'
import { MainWin } from './windows/MainWin'
import { CaptureWin } from './windows/CaptureWin'
import path from 'path'
import log from 'electron-log'
import conf, { HotKey, HotKeyConf } from '@/config/Conf'
import store from '@/store/index'
import HotKeyUtil from '@/utils/HotKeyUtil'
import CommonUtil from '@/utils/CommonUtil'
import * as ref from 'ref-napi'
import { DModel as M, DStruct, U, DTypes } from 'win32-api'
import StructDi from 'ref-struct-di'
import { FModel } from 'win32-def'
import { Win32Fns } from 'win32-api/dist/lib/user32/api'
import ffi from 'ffi-napi'
import SelectWin from '@/electron/windows/SelectWin'

const Struct = StructDi(ref)

'use strict'
declare const __static: string
export default class App {
  isDevelopment = process.env.NODE_ENV !== 'production'
  indexUrl: string = ''
  tray: Tray | null = null
  mainWin: MainWin | null = null
  captureWin: CaptureWin | null = null
  contentWin: ContentWin | null = null
  selectWin: SelectWin | null = null
  openDevTools = true
  user32: FModel.ExpandFnModel<Win32Fns>


  constructor() {
    protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])
    this.user32 = U.load()
    this.init().then(() => {
      Menu.setApplicationMenu(null)
      this.initTray()
      this.initHotKey()
      this.initIpc()
      this.initMain()
      // this.initContent()
    }).catch(err => {})
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
          this.mainWin.win.webContents.send(IPC.HOTKEY_INVALID, hotkey)
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
            this.contentWin.win.close()
          }
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

  /**
   * 监听渲染进程
   */
  private initIpc() {
    // 打开调试
    ipcMain.on(IPC.OPEN_DEVTOOL, () => {
      const focus = BrowserWindow.getFocusedWindow()
      if (focus != null) {
        focus.webContents.openDevTools()
      }
    })

    ipcMain.on(IPC.MAIN_LOG, (event, ...args: any[]) => {
      log.info(args)
    })

    ipcMain.on(IPC.OPEN_CAPTURE_WINDOW, (event, sourceId: string) => {
      const {width, height} = screen.getPrimaryDisplay().bounds
      conf.temp.set('source', {
        width: width,
        height: height,
        sourceId: sourceId
      })
      this.showOverlay()
    })

    ipcMain.on(IPC.OPEN_SELECT_WINDOW, (event, sources: string) => {
      if (this.selectWin == null) {
        this.selectWin = new SelectWin(this, sources)
      }
      this.selectWin.win.show()
    })

    ipcMain.on(IPC.CLOSE_SELECT_WINDOW, () => {
      if (this.selectWin != null) {
        this.selectWin.win.close()
      }
    })

    // 选择窗口完成
    ipcMain.on(IPC.SELECT_WINDOW_FINISH, (event, sourceId) => {
      if (this.selectWin != null) {
        this.selectWin.win.close()
      }
      const hWnd = parseInt(sourceId.split(':')[1])
      // win32 api获取窗口位置
      const rect: M.RECT_Struct = new Struct(DStruct.RECT)()
      const buf = Buffer.alloc(254)
      const len = this.user32.GetWindowTextW(hWnd, buf, buf.byteLength)
      const title = buf.toString('ucs2').replace('/\0+$/', '')
      const ok = this.user32.GetWindowRect(hWnd, rect.ref())
      let rectangle: Rectangle = {
        x: rect.left,
        y: rect.top,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      }
      // 屏幕缩放比例转换
      rectangle = screen.screenToDipRect(null, rectangle)
      if (ok && len > 0) {
        log.info(`title:${title}, left:${rect.left}, top:${rect.top}, right:${rect.right}, bottom:${rect.bottom}`)
        log.info(`title:${title}, left:${rectangle.x}, top:${rectangle.y}, width:${rectangle.width}, height:${rectangle.height}`)
        conf.temp.set('source', {
          width: rectangle.width,
          height: rectangle.height,
          sourceId: sourceId
        })
        this.showOverlay(rectangle)
      }
    })

    ipcMain.on(IPC.CLOSE_OVERLAY, () => {
      if (this.captureWin != null) {
        this.captureWin.win.close()
      }
    })

    ipcMain.on(IPC.OPEN_CONTENT, () => {
      this.showContent()
    })

    ipcMain.on(IPC.CLOSE_CONTENT, () => {
      if (this.contentWin != null) {
        this.contentWin.win.close()
      }
    })


    ipcMain.handle(IPC.CHANGE_HOTKEY, async (event, hotkey: HotKey) => {
      // 更改快捷键
      return HotKeyUtil.register(hotkey, this)
    })

    // 锁定窗口大小
    ipcMain.on(IPC.LOCK_CONTENT, () => {
      if (this.contentWin != null) {
        this.contentWin.win.setFocusable(false)
        // this.contentWin.win.blur()
      }
    })

  }

  /**
   * 遍历屏幕窗口回调
   */
  createEnumWinProc(): M.WNDENUMPROC {
    const enumWindowsProc = ffi.Callback(
      DTypes.BOOL,
      [DTypes.HWND, DTypes.LPARAM],
      (hWnd: M.HWND, lParam: M.LPARAM): M.BOOLEAN => {
        if (this.user32.IsWindowVisible(hWnd)) {
          const rect: M.RECT_Struct = new Struct(DStruct.RECT)()
          const buf = Buffer.alloc(254)
          const len = this.user32.GetWindowTextW(hWnd, buf, buf.byteLength)
          const title = buf.toString('ucs2').replace('/\0+$/', '')
          const ok = this.user32.GetWindowRect(hWnd, rect.ref())
          if (ok && len > 0) {
            log.info(`title:${title}, left:${rect.left}, top:${rect.top}, right:${rect.right}, bottom:${rect.bottom}`)
          }
        }
        return true
      }
    )
    process.on('exit', () => {
      // tslint:disable-next-line:no-unused-expression
      typeof enumWindowsProc // avoid gc
    })
    return enumWindowsProc
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
      this.mainWin = new MainWin(this)
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
    }
  }
}
