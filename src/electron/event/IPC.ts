import { BrowserWindow, ipcMain, Rectangle, screen } from 'electron'
import log from 'electron-log'
import conf, { HotKey } from '@/config/Conf'
import SelectWin from '@/electron/windows/SelectWin'
import HotKeyUtil from '@/utils/HotKeyUtil'
import { windowApi } from '@/electron/ffi/WindowApi'
import App from '@/electron/App'

export const KEYS = {
  OPEN_DEVTOOL: 'OPEN_DEVTOOL',
  // 打开裁剪区域窗口
  OPEN_CAPTURE_WINDOW: 'OPEN_CAPTURE_WINDOW',
  // 打开窗口选择窗口
  OPEN_SELECT_WINDOW: 'OPEN_SELECT_WINDOW',
  CLOSE_SELECT_WINDOW: 'CLOSE_SELECT_WINDOW',
  CAPTURE_WINDOW: 'CAPTURE_WINDOW',
  CAPTURE_SCREEN: 'CAPTURE_SCREEN',
  SELECT_WINDOW_FINISH: 'SELECT_WINDOW_FINISH',
  CLOSE_OVERLAY: 'CLOSE_OVERLAY',
  // 打开检测结果窗口
  OPEN_CONTENT: 'OPEN_CONTENT',
  CLOSE_CONTENT: 'CLOSE_CONTENT',
  LOCK_CONTENT: 'LOCK_CONTENT',
  FINISH_RECOGNIZE: 'FINISH_RECOGNIZE',
  HOTKEY_INVALID: 'CHANGE_HOTKEY',
  CHANGE_HOTKEY: 'CHANGE_HOTKEY',
  GET_SCREEN: 'GET_SCREEN',

  // 主界面切换到配置页
  ROUTE_API_CONFIG: 'ROUTE_API_CONFIG',

  MAIN_LOG: 'MAIN_LOG',
  MINIMIZE_MAIN_WINDOW() {

  }
}

export default class IPC {

  static register(app: App) {
    // 打开调试
    ipcMain.on(KEYS.OPEN_DEVTOOL, () => {
      const focus = BrowserWindow.getFocusedWindow()
      if (focus != null) {
        focus.webContents.openDevTools()
      }
    })

    ipcMain.on(KEYS.MAIN_LOG, (event, ...args: any[]) => {
      log.info(args)
    })

    ipcMain.on(KEYS.OPEN_CAPTURE_WINDOW, (event, sourceId: string) => {
      const {width, height} = screen.getPrimaryDisplay().bounds
      conf.temp.set('source', {
        width: width,
        height: height,
        sourceId: sourceId
      })
      app.showOverlay()
    })

    ipcMain.on(KEYS.OPEN_SELECT_WINDOW, (event, sources: string) => {
      if (app.selectWin == null) {
        app.selectWin = new SelectWin(app, sources)
      }
      // app.selectWin.win.show()
    })

    ipcMain.on(KEYS.CLOSE_SELECT_WINDOW, () => {
      if (app.selectWin != null) {
        app.selectWin.win.close()
      }
    })

    ipcMain.on(KEYS.CLOSE_OVERLAY, () => {
      if (app.captureWin != null) {
        app.captureWin.win.close()
      }
    })

    ipcMain.on(KEYS.OPEN_CONTENT, () => {
      app.showContent()
    })

    ipcMain.on(KEYS.CLOSE_CONTENT, () => {
      if (app.contentWin != null) {
        app.contentWin.win.close()
      }
    })

    // 选择窗口完成
    ipcMain.on(KEYS.SELECT_WINDOW_FINISH, (event, sourceId: string) => {
      this.showWindowRect(sourceId, app)
    })

    ipcMain.handle(KEYS.CHANGE_HOTKEY, async (event, hotkey: HotKey) => {
      // 更改快捷键
      return HotKeyUtil.register(hotkey, app)
    })

    // 锁定窗口大小
    ipcMain.on(KEYS.LOCK_CONTENT, () => {
      if (app.contentWin != null) {
        app.contentWin.win.setFocusable(false)
        // app.contentWin.win.blur()
      }
    })
  }

  /**
   * 选择选中窗口区域
   * @param sourceId
   * @param app
   */
  private static showWindowRect(sourceId: string, app: App) {
    if (app.selectWin != null) {
      app.selectWin.win.close()
    }
    const hWnd = parseInt(sourceId.split(':')[1])
    // const buf = Buffer.alloc(254)
    // const len = windowApi.user32.GetWindowTextW(hWnd, buf, buf.byteLength)
    // const title = buf.toString('ucs2').replace('/\0+$/', '')
    // const rect2: M.RECT_Struct = new Struct(DStruct.RECT)()
    // 目标窗口移到最前面
    windowApi.user32.BringWindowToTop(hWnd)
    // windowApi.user32.GetWindowRect(hWnd, rect2.ref())
    // 获取窗口位置
    const rect = windowApi.getWinFrameBounds(hWnd)
    if (rect != null) {
      let rectangle: Rectangle = {
        x: rect.left,
        y: rect.top,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      }
      // 屏幕缩放比例转换
      rectangle = screen.screenToDipRect(null, rectangle)
      log.info(`FrameBounds left:${rect.left}, top:${rect.top}, right:${rect.right}, bottom:${rect.bottom}`)
      // log.info(`WindowRect left:${rect2.left}, top:${rect2.top}, right:${rect2.right}, bottom:${rect2.bottom}`)
      conf.temp.set('source', {
        width: rectangle.width,
        height: rectangle.height,
        sourceId: sourceId
      })
      app.showOverlay(rectangle)
    }
  }
}
