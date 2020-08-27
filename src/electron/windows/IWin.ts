import App from '@/electron/App'
import { BrowserWindow } from "electron"

export default interface IWin {
  app: App
  win: BrowserWindow
}
