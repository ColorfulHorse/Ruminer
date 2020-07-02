import { BrowserWindow, ipcMain } from 'electron'
import { App } from '../App'
export class ContentWin extends BrowserWindow {
    app: App
    constructor(app: App) {
        super({
            maximizable: false,
            fullscreen: false,
            frame: false,
            transparent: true,
            width: 800,
            height: 200,
            closable: true,
            webPreferences: {
                nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION)
            }
        })
        this.app = app
        this.init()
    }

    init() {
        this.on('close', () => {
            this.app.contentWin = null
        })
        this.loadURL(this.app.indexUrl + '/#/content').then(() => {
            // this.webContents.openDevTools()
        })
    }
}