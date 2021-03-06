export interface AppInfo {
  name: string
}

export const appInfo: AppInfo = {
  name: 'Ruminer'
}

export const Urls = {
  baiduTranslate: 'http://api.fanyi.baidu.com/api/trans/vip/translate'
}

export enum Platform {
  baidu,
  tencent
}

export const Platforms = ['百度', '腾讯']

export class StoreKey {
  static readonly CAPTURE_RECT = 'CAPTURE_RECT'
  // 捕捉屏幕
  static readonly HOT_KEY_CAPTURE_SCREEN = 'HOT_KEY_CAPTURE_SCREEN'
  // 捕捉窗口
  static readonly HOT_KEY_CAPTURE_WINDOW = 'HOT_KEY_CAPTURE_WINDOW'
  // 翻译相关配置
  static readonly TRANSLATE_OPTION = 'TRANSLATE_OPTION'
}

export class StoreDefault {
  // 捕捉屏幕
  static readonly DEFAULT_KEY_CAPTURE_SCREEN = 'Alt+Shift+D'

  // 捕捉窗口
  static readonly DEFAULT_KEY_CAPTURE_WINDOW = 'Alt+Shift+W'
}

export class BaiduTranslate {
  static readonly APP_ID = '20200721000523268'
  static readonly SECRET_KEY = 'skvTgvhTbhBUIQQRA6Kv'
}

export class BaiduOcr {
  static readonly APP_ID = '20624645'
  static readonly API_KEY = 'C0TsZkb1hYEg1s7LpoQ2FsxQ'
  static readonly SECRET_KEY = 'xa6ibr45YAdfNOXyv8SVy181NcLN959z'
}

export class HotKeys {
  static readonly CAPTURE_SCREEN = 'captureScreen'
  static readonly CAPTURE_WINDOW = 'captureWindow'
  static readonly START_RECOGNIZE = 'startRecognize'
}

export class Mutations {
  static readonly MUTATION_RESULT_TEXT = 'MUTATION_RESULT_TEXT'
  static readonly MUTATION_SOURCE_LANG = 'MUTATION_SOURCE_LANG'
  static readonly MUTATION_TARGET_LANG = 'MUTATION_TARGET_LANG'
  static readonly MUTATION_BAIDU_OCRAPPID = 'MUTATION_BAIDU_OCRAPPID'
  static readonly MUTATION_BAIDU_OCRAPIKEY = 'MUTATION_BAIDU_OCRAPIKEY'
  static readonly MUTATION_BAIDU_OCRAPISECRET = 'MUTATION_BAIDU_OCRAPISECRET'
  static readonly MUTATION_BAIDU_TRANSLATE_APPID = 'MUTATION_BAIDU_TRANSLATE_APPID'
  static readonly MUTATION_BAIDU_TRANSLATE_SECRET = 'MUTATION_BAIDU_TRANSLATE_SECRET'
  static readonly MUTATION_CHANGE_HOTKEY = 'MUTATION_CHANGE_HOTKEY'
}
