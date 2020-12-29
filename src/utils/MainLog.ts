import { ipcRenderer } from 'electron'
import { KEYS } from '@/electron/event/IPC'
export class MainLog {
  static info(...params: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      ipcRenderer.send(KEYS.MAIN_LOG, params)
    }
  }
}
