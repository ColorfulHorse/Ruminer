import { Rect } from '../graphics/Graphics';

export class IPC {
  static OPEN_DEVTOOL = 'OPEN_DEVTOOL'
  // 选择区域
  static SELECT_AREA = 'SELECT_AREA'
  static CLOSE_OVERLAY = 'CLOSE_OVERLAY'
}

export class Capture {
  static RECT: Rect | null = null
}
