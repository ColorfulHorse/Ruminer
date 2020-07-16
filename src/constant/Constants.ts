import { Rect } from '../graphics/Graphics'

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
  static readonly HOT_KEY_CAPTURE = 'HOT_KEY_CAPTURE'
}

export class StoreDefault {
  // 捕捉屏幕
  static readonly HOT_KEY_CAPTURE = 'Alt+Shift+C'
}

export class BaiduApi {
  static readonly APP_ID = '20624645'
  static readonly API_KEY = 'C0TsZkb1hYEg1s7LpoQ2FsxQ'
  static readonly SECRET_KEY = 'xa6ibr45YAdfNOXyv8SVy181NcLN959z'
}

export class Mutations {
  static readonly UPDATE_RESULT_TEXT = 'UPDATE_RESULT_TEXT'
}
