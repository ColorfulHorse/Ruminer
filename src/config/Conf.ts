/**
 * 本地配置
 */
import { Rect } from '@/graphics/Graphics'
import ElectronStore from 'electron-store'
import { BaiduToken } from '@/network/response/BaiduToken'

export interface RootConf {
  common: ElectronStore<CommonConf>
  hotkey: ElectronStore<HotKeyConf>
  translate: ElectronStore<TranslateConf>
  temp: ElectronStore<TempConf>
}

export interface TempConf {
  // 截取区域
  captureRect: Rect | null
  // 捕获视频源
  source: MediaSource | null
}

export interface MediaSource {
  mode: 'screen' | 'window'
  width: number,
  height: number,
  sourceId: string
}

export interface CommonConf {
  firstInstall: boolean
}

export interface HotKeyConf {
  captureScreen: HotKey
  captureWindow: HotKey
  // startRecognize: HotKey
}

export interface HotKey {
  name: string
  key: keyof HotKeyConf
  // 上一次设置的快捷键
  old?: string
  value: string
  valid: boolean
}

export interface TranslateConf {
  // 源语言
  source: string
  // 目标语言
  target: string
  baiduToken: BaiduToken | null
  baiduOcrSecret: string
  baiduOcrApiKey: string
  baiduTransAppId: string
  baiduTransSecret: string
}

export default {
  common: new ElectronStore<CommonConf>({
    name: 'commonConf',
    defaults: {
      firstInstall: true
    }
  }),
  temp: new ElectronStore<TempConf>({
    name: 'tempConf',
    defaults: {
      captureRect: null,
      source: null
    }
  }),
  hotkey: new ElectronStore<HotKeyConf>({
    name: 'hotkeyConf',
    defaults: {
      captureScreen: { name: '捕获屏幕', key: 'captureScreen', value: 'Shift+Alt+D', valid: true },
      captureWindow: { name: '捕获窗口', key: 'captureWindow', value: 'Shift+Alt+W', valid: true }
      // startRecognize: { name: '开始翻译', key: 'startRecognize', value: 'Shift+Alt+Q', valid: true }
    }
  }),
  translate: new ElectronStore<TranslateConf>({
    name: 'translateConf',
    defaults: {
      source: 'en',
      target: 'zh',
      baiduToken: null,
      baiduOcrApiKey: '',
      baiduOcrSecret: '',
      baiduTransAppId: '',
      baiduTransSecret: ''
    }
  })
}
