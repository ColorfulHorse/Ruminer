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
            focusable: true,
            width: 800,
            height: 200,
            // maxWidth: 800,
            // maxHeight: 200,
            // resizable: false,
            movable: true,
            closable: true,
            alwaysOnTop: true,
            y: 0,
            // 隐藏任务栏图标
            // skipTaskbar: true,
            webPreferences: {
                nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
                nodeIntegrationInWorker: true
            }
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
        // 锁定窗口大小
        ipcMain.on(IPC.LOCK_CONTENT, (ev, size: Size) => {
            // log.info(size)
            // this.setResizable(false)
            // this.setSize(size.width, size.height)
            // this.setMaximumSize(size.width, size.height)
        })
        this.loadURL(this.app.indexUrl + '/#/content').then(() => {
          if (this.app.openDevTools) {
            this.webContents.openDevTools()
          }
        })
    }
}
