export class IPC {
  static readonly OPEN_DEVTOOL = 'OPEN_DEVTOOL'
  // 选择区域
  static readonly SELECT_AREA = 'SELECT_AREA'
  static readonly CLOSE_OVERLAY = 'CLOSE_OVERLAY'
  // 打开检测结果窗口
  static readonly OPEN_CONTENT = 'OPEN_CONTENT'
  static readonly CLOSE_CONTENT = 'CLOSE_CONTENT'
  static readonly LOCK_CONTENT = 'LOCK_CONTENT'
  static readonly FINISH_RECOGNIZE = 'FINISH_RECOGNIZE'
}

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

export class Mutations {
  static readonly MUTATION_RESULT_TEXT = 'MUTATION_RESULT_TEXT'
  static readonly MUTATION_KEY_CAPTURE_SCREEN = 'MUTATION_KEY_CAPTURE_SCREEN'
  static readonly MUTATION_KEY_CAPTURE_WINDOW = 'MUTATION_KEY_CAPTURE_WINDOW'
}
