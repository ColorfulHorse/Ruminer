/**
 * 配置
 */
import { Rect } from '../graphics/Graphics'
import ElectronStore from 'electron-store'

export interface RootConf {
  common: ElectronStore<CommonConf>
  hotkey: ElectronStore<HotKeyConf>
  translate: ElectronStore<TranslateConf>
}

export interface CommonConf {
  captureRect: Rect | null
}

export interface HotKeyConf {
  captureScreen: string
  captureWindow: string
}

export interface TranslateConf {
  // 源语言
  source: string
  // 目标语言
  target: string
}

export default {
  common: new ElectronStore<CommonConf>({
    name: 'commonConf',
    defaults: {
      captureRect: null
    }
  }),
  hotkey: new ElectronStore<HotKeyConf>({
    name: 'hotkeyConf',
    defaults: {
      captureScreen: 'Alt+Shift+D',
      captureWindow: 'Alt+Shift+W'
    }
  }),
  translate: new ElectronStore<TranslateConf>({
    name: 'translateConf',
    defaults: {
      source: 'eng',
      target: 'chi_sim'
    }
  })
}
