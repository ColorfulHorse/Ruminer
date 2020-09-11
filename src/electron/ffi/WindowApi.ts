import ffi, { Library } from 'ffi-napi'
import { DStruct, U, DModel as M, DTypes as T, FModel, DStructExt } from 'win32-api'
import log from 'electron-log'
import { DWMWINDOWATTRIBUTE, LOGFONTW, LOGFONTW_Struct, TEXTMETRICW, TEXTMETRICW_Struct } from './types'
import StructDi from 'ref-struct-di'
import * as ref from 'ref-napi'
import refArray from 'ref-array-napi'
import { Win32Fns } from 'win32-api/dist/lib/user32/api'
import { Type } from 'ref-napi'

export const Struct = StructDi(ref)

export class WindowApi {
  private _DWM: any | null = null
  private _Gdi32: any | null = null
  private _user32b: any | null = null
  private _user32: FModel.ExpandFnModel<Win32Fns> | null = null

  get user32() {
    // 初始化需要200ms，可以放到别处初始化
    if (this._user32 == null) {
      log.info('init user32')
      log.info(Date.now())
      this._user32 = U.load(['IsWindowVisible', 'BringWindowToTop', 'BringWindowToTop', 'GetWindowTextW', 'GetWindowRect', 'GetWindowDC'])
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

  get user32b() {
    if (this._user32b == null) {
      this._user32b = ffi.Library('user32', {
        // 返回状态码，参数1.窗口句柄，2.窗口信息key，3,窗口信息结果对象指针，4.窗口信息结果对象大小
        GetWindowDC: [T.HDC, [T.HWND]]
      })
    }
    return this._user32b
  }

  get Gdi32() {
    if (this._Gdi32 == null) {
      log.info('init Gdi32')
      log.info(Date.now())
      this._DWM = ffi.Library('Gdi32', {
        EnumFontFamiliesExW: [T.INT, [T.HDC, 'pointer', 'pointer', T.LPARAM, T.DWORD]]
      })
      log.info(Date.now())
    }
    return this._DWM
  }

  static _instance: WindowApi | null = null

  private constructor() {
  }

  getWinFrameBounds(hwnd: number) {
    const rect: M.RECT_Struct = new Struct(DStruct.RECT)()
    log.info(`rect length: ${rect.ref().length}`)
    const result = this.DWM.DwmGetWindowAttribute(hwnd, DWMWINDOWATTRIBUTE.DWMWA_EXTENDED_FRAME_BOUNDS, rect.ref(), rect.ref().length)
    if (result === 0) {
      return rect
    } else {
      return null
    }
  }

  getSystemFonts(hwnd: number) {
    const hdc = this.user32b.GetWindowDC(hwnd)
    log.info(`hdc: ${hdc}`)
    const enumWindowsProc = ffi.Callback(
      T.INT,
      ['pointer', 'pointer', T.DWORD, T.LPARAM],
      (logfontw: M._POINTER, textmetricw: M._POINTER, dword: M.DWORD, lParam: M.LPARAM): M.INT => {
        log.info(logfontw)
        log.info(logfontw.deref(logfontw))
        log.info(textmetricw)
        log.info(textmetricw.deref(logfontw))
        return 0
      })
    const CharArray100 = refArray(ref.types.char, 32)
    const logFont = new Struct({
      lfHeight: ref.types.long,
      lfWidth: ref.types.long,
      lfEscapement: ref.types.long,
      lfOrientation: ref.types.long,
      lfWeight: ref.types.byte,
      lfItalic: ref.types.byte,
      lfUnderline: ref.types.byte,
      lfStrikeOut: ref.types.byte,
      lfCharSet: ref.types.byte,
      lfOutPrecision: ref.types.byte,
      lfClipPrecision: ref.types.byte,
      lfQuality: ref.types.byte,
      lfPitchAndFamily: ref.types.byte,
      lfFaceName: CharArray100
    })()
    log.info(`logFont length: ${logFont.ref().length}`)
    logFont.lfPitchAndFamily = 0
    // DEFAULT_CHARSET
    logFont.lfCharSet = 1
    // const CharArray100 = refArray(ref.types.char, 32)
    const bufferValue = Buffer.from('')
    // const value1 = new CharArray100()
    // for (let i = 0, l = bufferValue.length; i < l; i++) {
    //   value1[i] = bufferValue[i]
    // }
    const strArray = [...bufferValue]
    const value2 = ref.alloc(CharArray100, strArray)
    logFont.lfFaceName = value2
    this.Gdi32.EnumFontFamiliesExW(hdc, logFont.ref(), enumWindowsProc, 0, 0)
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
