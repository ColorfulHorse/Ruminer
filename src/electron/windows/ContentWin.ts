import  log  from 'electron-log'
import { BrowserWindow, ipcMain, Size } from 'electron'
import App from '../App'
import { IPC } from '../../constant/Constants'
export class ContentWin extends BrowserWindow {
    app: App
    constructor(app: App) {
        super({
            maximizable: false,
            fullscreen: false,
            frame: false,
            transparent: true,
            focusable: false,
            width: 800,
            height: 200,
            // maxWidth: 800,
            // maxHeight: 200,
            // resizable: false,
            movable: true,
            closable: true,
            // alwaysOnTop: true,
            y: 0,
            // 隐藏任务栏图标
            skipTaskbar: true,
            webPreferences: {
                nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
                nodeIntegrationInWorker: true
            },
            show: false
        })
        this.app = app
        this.init()
    }

    init() {
        this.on('close', () => {
            log.info('close content win')
            this.webContents.send(IPC.FINISH_RECOGNIZE)
        })
        this.on('closed', () => {
            log.info('closed content win')
            this.app.contentWin = null
        })
        this.loadURL(this.app.indexUrl + '/#/content').then(() => {
          if (this.app.openDevTools) {
            this.webContents.openDevTools()
          }
        })
    }
}
