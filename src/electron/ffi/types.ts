import { LONG, WCHAR_String } from 'win32-def/dist/lib/win-model/common'
import { StructInstanceBase } from 'win32-def/dist/lib/win-model/struct'
import * as ref from 'ref-napi'
import refArray from 'ref-array-napi'
import wchar, { string } from 'ref-wchar-napi'
import StructDi from 'ref-struct-di'

export const Struct = StructDi(ref)

export enum DWMWINDOWATTRIBUTE {
  DWMWA_NCRENDERING_ENABLED = 1,
  DWMWA_NCRENDERING_POLICY,
  DWMWA_TRANSITIONS_FORCEDISABLED,
  DWMWA_ALLOW_NCPAINT,
  DWMWA_CAPTION_BUTTON_BOUNDS,
  DWMWA_NONCLIENT_RTL_LAYOUT,
  DWMWA_FORCE_ICONIC_REPRESENTATION,
  DWMWA_FLIP3D_POLICY,
  DWMWA_EXTENDED_FRAME_BOUNDS,
  DWMWA_HAS_ICONIC_BITMAP,
  DWMWA_DISALLOW_PEEK,
  DWMWA_EXCLUDED_FROM_PEEK,
  DWMWA_CLOAK,
  DWMWA_CLOAKED,
  DWMWA_FREEZE_REPRESENTATION,
  DWMWA_LAST
}

export interface TEXTMETRICW_Struct extends StructInstanceBase {
  tmHeight: number
  tmAscent: number
  tmDescent: number
  tmInternalLeading: number
  tmExternalLeading: number
  tmAveCharWidth: number
  tmMaxCharWidth: number
  tmWeight: number
  tmOverhang: number
  tmDigitizedAspectX: number
  tmDigitizedAspectY: number
  tmFirstChar: string
  tmLastChar: string
  tmDefaultChar: string
  tmBreakChar: string
  tmItalic: number
  tmUnderlined: number
  tmStruckOut: number
  tmPitchAndFamily: number
  tmCharSet: number
}

export interface LOGFONTW_Struct extends StructInstanceBase {
  lfHeight: number
  lfWidth: number
  lfEscapement: number
  lfOrientation: number
  lfWeight: number
  lfItalic: number
  lfUnderline: number
  lfStrikeOut: number
  lfCharSet: number
  lfOutPrecision: number
  lfClipPrecision: number
  lfQuality: number
  lfPitchAndFamily: number
  lfFaceName: string
}

export const LOGFONTW = {
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
  lfFaceName: refArray(wchar, 32)
}

export const ENUMLOGFONTEXW = {
  elfLogFont: new Struct(LOGFONTW),
  elfFullName: refArray(wchar, 32),
  elfStyle: refArray(wchar, 32),
  elfScript: refArray(wchar, 32)
}

export declare const TEXTMETRICW: {
  tmHeight: string
  tmAscent: string
  tmDescent: string
  tmInternalLeading: string
  tmExternalLeading: string
  tmAveCharWidth: string
  tmMaxCharWidth: string
  tmWeight: string
  tmOverhang: string
  tmDigitizedAspectX: string
  tmDigitizedAspectY: string
  tmFirstChar: string
  tmLastChar: string
  tmDefaultChar: string
  tmBreakChar: string
  tmItalic: string
  tmUnderlined: string
  tmStruckOut: string
  tmPitchAndFamily: string
  tmCharSet: string
}

// export interface DWM {
//   DwmGetWindowAttribute()
// }
