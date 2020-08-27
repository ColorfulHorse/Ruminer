import { HotKey, HotKeyConf } from '@/config/Conf'
import { HotKeys, IPC } from '@/constant/Constants'
import App from '@/electron/App'
import { globalShortcut } from 'electron'
import log from 'electron-log'

export default class HotKeyUtil {
  static readonly CAPTURE_SCREEN = 'captureScreen'
  static readonly CAPTURE_WINDOW = 'captureWindow'
  static readonly START_RECOGNIZE = 'startRecognize'

  static register(hotkey: HotKey, app: App) {
    let callback: (() => void) | null = null
    switch (hotkey.key) {
      case HotKeys.CAPTURE_SCREEN:
        callback = () => {
          if (app.mainWin) {
            app.mainWin.win.webContents.send(IPC.CAPTURE_SCREEN)
          }
        }
        break
      case HotKeys.CAPTURE_WINDOW:
        callback = () => {
          if (app.mainWin) {
            app.mainWin.win.webContents.send(IPC.CAPTURE_WINDOW)
          }
        }
        break
      case HotKeys.START_RECOGNIZE:
        callback = () => {
          app.showContent()
        }
        break
    }
    hotkey.valid = false
    if (callback != null) {
      hotkey.valid = globalShortcut.register(hotkey.value, callback)
      log.info(`注册快捷键：${hotkey.key}-${hotkey.name}-${hotkey.value}-${hotkey.valid}`)
      if (hotkey.valid) {
        if (hotkey.old) {
          // 注销之前的快捷键
          globalShortcut.unregister(hotkey.old)
          hotkey.old = hotkey.value
        }
      }
    }
    return hotkey
  }

  /**
   * 获取组合按键
   * @param event
   */
  static getKeys(event: KeyboardEvent) {
    const keys = ['Control', 'Shift', 'Alt']
    if ((event.ctrlKey || event.altKey || event.shiftKey) && !keys.includes(event.key)) {
      const ctrl = event.ctrlKey ? 'Ctrl+' : ''
      const shift = event.shiftKey ? 'Shift+' : ''
      const alt = event.altKey ? 'Alt+' : ''
      let key = ''
      if (event.key.length > 1) {
        key = event.key.substring(0, 1).toUpperCase() + event.key.substring(1)
      } else {
        key = event.key.toUpperCase()
      }
      return `${ctrl}${shift}${alt}${key}`
    }
    return null
  }
}
