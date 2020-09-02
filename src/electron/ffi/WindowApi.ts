import ffi, { Library } from 'ffi-napi'
import { DStruct, U, DModel as M, DTypes as T, FModel } from 'win32-api'
import log from 'electron-log'
import { DWMWINDOWATTRIBUTE } from './types'
import StructDi from 'ref-struct-di'
import * as ref from 'ref-napi'
import { Win32Fns } from 'win32-api/dist/lib/user32/api'

export const Struct = StructDi(ref)
export class WindowApi {
  private _DWM: any | null = null
  private _user32: FModel.ExpandFnModel<Win32Fns> | null = null

  get user32() {
    // 初始化需要200ms，可以放到别处初始化
    if (this._user32 == null) {
      log.info('init user32')
      log.info(Date.now())
      this._user32 = U.load()
      log.info(Date.now())
    }
    return this._user32
  }

  get DWM() {
    if (this._DWM == null) {
      log.info('init DWM')
      log.info(Date.now())
      this._DWM = ffi.Library('Dwmapi', {
        // https://docs.microsoft.com/zh-cn/windows/win32/api/dwmapi/nf-dwmapi-dwmgetwindowattribute
        // 返回状态码，参数1.窗口句柄，2.窗口信息key，3,窗口信息结果对象指针，4.窗口信息结果对象大小
        DwmGetWindowAttribute: [T.HRESULT, [T.HWND, T.DWORD, T.PVOID, T.DWORD]]
      })
      log.info(Date.now())
    }
    return this._DWM
  }

  static _instance: WindowApi | null = null
  private constructor() {}

  getWinFrameBounds(hwnd: number) {
    const rect: M.RECT_Struct = new Struct(DStruct.RECT)()
    const result = this.DWM.DwmGetWindowAttribute(hwnd, DWMWINDOWATTRIBUTE.DWMWA_EXTENDED_FRAME_BOUNDS, rect.ref(), rect.ref().length)
    if (result === 0) {
      return rect
    } else {
      return null
    }
  }

  /**
   * 遍历屏幕窗口回调
   */
  createEnumWinProc(): M.WNDENUMPROC {
    const enumWindowsProc = ffi.Callback(
      T.BOOLEAN,
      [T.HWND, T.LPARAM],
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
      // eslint-disable-next-line
      typeof enumWindowsProc // avoid gc
    })
    return enumWindowsProc
  }

  static getInstance() {
    if (this._instance == null) {
      this._instance = new WindowApi()
    }
    return this._instance
  }
}

export const windowApi = WindowApi.getInstance()
// export const win32 = WindowApi.getInstance().user32
