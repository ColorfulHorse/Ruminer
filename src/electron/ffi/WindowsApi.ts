import ffi, { Library } from 'ffi-napi'
import { DStruct, U, DModel as M, DTypes as T, FModel, DStructExt } from 'win32-api'
import log from 'electron-log'
import { DWMWINDOWATTRIBUTE, ENUMLOGFONTEXW, LOGFONTW, LOGFONTW_Struct, TEXTMETRICW, TEXTMETRICW_Struct } from './types'
import StructDi from 'ref-struct-di'
import ref, { NULL } from 'ref-napi'
import refArray from 'ref-array-napi'
import { Win32Fns } from 'win32-api/dist/lib/user32/api'
import wchar, { string, toString } from 'ref-wchar-napi'

export const Struct = StructDi(ref)

export class WindowsApi {
  private _DWM: any | null = null
  private _Gdi32: any | null = null
  private _user32b: any | null = null
  private _user32: FModel.ExpandFnModel<Win32Fns> | null = null

  get user32() {
    // 初始化需要200ms，可以放到别处初始化
    if (this._user32 == null) {
      log.info('init user32')
      this._user32 = U.load(['IsWindowVisible', 'BringWindowToTop', 'BringWindowToTop', 'GetWindowTextW', 'GetWindowRect', 'GetWindowDC'])
    }
    return this._user32
  }

  get DWM() {
    if (this._DWM == null) {
      this._DWM = ffi.Library('Dwmapi', {
        // https://docs.microsoft.com/zh-cn/windows/win32/api/dwmapi/nf-dwmapi-dwmgetwindowattribute
        // 返回状态码，参数1.窗口句柄，2.窗口信息key，3,窗口信息结果对象指针，4.窗口信息结果对象大小
        DwmGetWindowAttribute: [T.HRESULT, [T.HWND, T.DWORD, T.PVOID, T.DWORD]]
      })
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
        EnumFontFamiliesExW: [T.INT, [T.HDC, 'pointer', 'pointer', T.LPARAM, T.DWORD]],
        EnumFontFamiliesW: [T.INT, [T.HDC, T.POINT, 'pointer', T.LPARAM]]
      })
      log.info(Date.now())
    }
    return this._DWM
  }

  static _instance: WindowsApi | null = null

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

  /**
   * 遍历系统字体
   * https://docs.microsoft.com/en-us/windows/win32/api/wingdi/nf-wingdi-enumfontfamiliesexw
   * https://docs.microsoft.com/en-us/windows/win32/api/gdiplusheaders/nf-gdiplusheaders-fontcollection-getfamilies
   */
  getSystemFonts() {
    const fonts: Array<string> = []
    const hdc = this.user32b.GetWindowDC(0)
    log.info(`hdc: ${hdc}`)
    const LogFontType = new Struct(LOGFONTW)
    const ENUMLOGFONTEXWType = new Struct(ENUMLOGFONTEXW)
    const enumFontsProc = ffi.Callback(
      T.INT,
      ['pointer', 'pointer', T.DWORD, T.LPARAM],
      (lpelfe: Buffer, lpntme: Buffer, FontType: any, lParam: any): M.INT => {
        log.info(`address: ${lpelfe.address(lpelfe)}`)
        lpelfe = ref.reinterpretUntilZeros(lpelfe, ENUMLOGFONTEXWType.size)
        // log.info(lpelfe)
        if (lpelfe == null) {
          log.info('enum null')
          return 0
        }
        const data = ref.get(lpelfe, 0, ENUMLOGFONTEXWType)
        const font = toString(data.elfFullName.buffer).replace('/\0+$/', '')
        // log.info(`find font: ${font}`)
        fonts.push(font)
        return 1
      })
    const logFont = LogFontType()
    const buf = Buffer.alloc(32)
    string.set(buf, 0, '')
    logFont.lfCharSet = 1
    const res = this.Gdi32.EnumFontFamiliesExW(hdc, logFont.ref(), enumFontsProc, 222, 0)
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
      this._instance = new WindowsApi()
    }
    return this._instance
  }
}

export const windowsApi = WindowsApi.getInstance()
// export const win32 = WindowApi.getInstance().user32
