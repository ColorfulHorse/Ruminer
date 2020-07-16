import  log  from 'electron-log'
import { BrowserWindow, ipcMain, Size } from 'electron'
import { App } from '../App'
import { IPC } from '../../constant/Constants'
export class ContentWin extends BrowserWindow {
    app: App
    constructor(app: App) {
        super({
            maximizable: false,
            fullscreen: false,
            frame: false,
            transparent: true,
            useContentSize: true,
            resizable: false,
            movable: true,
            closable: true,
            alwaysOnTop: true,
            y: 0,
            // 隐藏任务栏图标
            skipTaskbar: true,
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
            this.webContents.send(IPC.FINISH_RECOGNIZE)
        })
        this.on('closed', () => {
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
            this.webContents.openDevTools()
        })
    }
}
