import { ipcRenderer } from 'electron'
import { IPC } from '@/constant/Constants'
export class MainLog {
  static info(...params: any[]) {
    ipcRenderer.send(IPC.MAIN_LOG, params)
  }
}
