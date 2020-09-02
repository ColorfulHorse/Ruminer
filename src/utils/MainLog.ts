import { ipcRenderer } from 'electron'
import { KEYS } from '@/electron/event/IPC'
export class MainLog {
  static info(...params: any[]) {
    ipcRenderer.send(KEYS.MAIN_LOG, params)
  }
}
