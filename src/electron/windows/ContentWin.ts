import  log  from 'electron-log'
import { BrowserWindow, ipcMain, Size, dialog } from 'electron'
import App from '../App'
import { KEYS } from '@/electron/event/IPC'
import IWin from '@/electron/windows/IWin'
export class ContentWin implements IWin {
    app: App
    win: BrowserWindow

    /**
     *
     * @param app
     * @param sourceId 捕获源的id
     */
    constructor(app: App) {
        this.win = new BrowserWindow({
            maximizable: false,
            fullscreen: false,
            frame: false,
            transparent: true,
            focusable: false,
            width: 800,
            height: 200,
            // maxWidth: 800,
            // maxHeight: 200,
            resizable: false,
            movable: true,
            closable: true,
            // alwaysOnTop: true,
            y: 0,
            // 隐藏任务栏图标
            skipTaskbar: true,
            webPreferences: {
                nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
                nodeIntegrationInWorker: true,
                enableRemoteModule: true,
                webSecurity: false
            },
            show: false
        })
        this.app = app
        this.init()
    }

    init() {
        this.win.on('close', () => {
            log.info('close content win')
            this.win.webContents.send(KEYS.FINISH_RECOGNIZE)
        })
        this.win.on('closed', () => {
            this.app.contentWin = null
        })
        this.win.loadURL(this.app.indexUrl + '/#/content').then(() => {
          if (this.app.openDevTools) {
              this.win.webContents.openDevTools()
          }
        })
    }
}
