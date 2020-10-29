import { HotKey, HotKeyConf } from '@/config/Conf'
import { HotKeys } from '@/constant/Constants'
import { KEYS } from '@/electron/event/IPC'
import App from '@/electron/App'
import { globalShortcut } from 'electron'
import log from 'electron-log'

export default class HotKeyUtil {
  static readonly CAPTURE_SCREEN = 'captureScreen'
  static readonly CAPTURE_WINDOW = 'captureWindow'
  static readonly START_RECOGNIZE = 'startRecognize'

  static register(hotkey: HotKey, app: App) {
    if (!hotkey.enable) {
      return hotkey
    }
    let callback: (() => void) | null = null
    switch (hotkey.key) {
      case HotKeys.CAPTURE_SCREEN:
        callback = () => {
          if (app.mainWin) {
            app.mainWin.win.webContents.send(KEYS.CAPTURE_SCREEN)
          }
        }
        break
      case HotKeys.CAPTURE_WINDOW:
        callback = () => {
          if (app.mainWin) {
            app.mainWin.win.webContents.send(KEYS.CAPTURE_WINDOW)
          }
        }
        break
      // case HotKeys.START_RECOGNIZE:
      //   callback = () => {
      //     app.showContent()
      //   }
      //   break
    }
    hotkey.valid = false
    if (callback != null) {
      hotkey.valid = globalShortcut.register(hotkey.value, callback)
      log.info(`注册快捷键：${hotkey.key}-${hotkey.name}-${hotkey.value}-${hotkey.valid}`)
      if (hotkey.valid) {
        if (hotkey.old && hotkey.old !== hotkey.value) {
          // 注销之前的快捷键
          globalShortcut.unregister(hotkey.old)
          hotkey.old = hotkey.value
        }
      }
    }
    return hotkey
  }

  static unregister(hotkey: HotKey) {
    globalShortcut.unregister(hotkey.value)
    hotkey.enable = false
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
      if (event.key === 'Process') {
        return null
      }
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
