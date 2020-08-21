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
}

export interface CommonConf {
  captureRect: Rect | null
}

export interface HotKeyConf {
  captureScreen: HotKey
  captureWindow: HotKey
  startRecognize: HotKey
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
  baiduOcrAppId: string
  baiduOcrSecret: string
  baiduOcrApiKey: string
  baiduTransAppId: string
  baiduTransSecret: string
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
      captureScreen: { name: '捕获屏幕', key: 'captureScreen', value: 'Shift+Alt+D', valid: true },
      captureWindow: { name: '捕获窗口', key: 'captureWindow', value: 'Shift+Alt+W', valid: true },
      startRecognize: { name: '开始翻译', key: 'startRecognize', value: 'Shift+Alt+Q', valid: true }
    }
  }),
  translate: new ElectronStore<TranslateConf>({
    name: 'translateConf',
    defaults: {
      source: 'en',
      target: 'zh',
      baiduToken: null,
      baiduOcrAppId: '20624645',
      baiduOcrApiKey: 'C0TsZkb1hYEg1s7LpoQ2FsxQ',
      baiduOcrSecret: 'xa6ibr45YAdfNOXyv8SVy181NcLN959z',
      baiduTransAppId: '20200721000523268',
      baiduTransSecret: 'skvTgvhTbhBUIQQRA6Kv'
    }
  })
}
