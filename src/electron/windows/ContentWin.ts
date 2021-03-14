import  log  from 'electron-log'
import { BrowserWindow, screen, ipcMain } from 'electron'
import App from '../App'
import IPC, { KEYS } from '@/electron/event/IPC'
import IWin from '@/electron/windows/IWin'
import { MainLog } from '@/utils/MainLog'
export class ContentWin implements IWin {
    app: App
    win: BrowserWindow
    width = 0
    height = 200
    resizing = false
    /**
     *
     * @param app
     * @param sourceId 捕获源的id
     */
    constructor(app: App) {
        const { width, height } = screen.getPrimaryDisplay().workArea
        this.width = width / 3 * 2
        this.win = new BrowserWindow({
            maximizable: false,
            fullscreen: false,
            frame: false,
            transparent: true,
            // focusable: true,
            width: this.width,
            height: this.height,
            minWidth: this.width,
            minHeight: this.height,
            // maxWidth: this.width,
            // maxHeight: this.height,
            resizable: true,
            movable: true,
            closable: true,
            skipTaskbar: true,
            x: (width - this.width) / 2,
            y: height - this.height,
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
        this.win.on('closed', () => {
            this.app.contentWin = null
        })
        this.win.on('will-resize', () => {
            this.resizing = true
        })
        this.win.on('resize', () => {
            if (this.resizing) {
                const width = this.win.getSize()[0]
                const height = this.win.getSize()[1]
                log.info(`resize: ${width}, height: ${height}`)
                this.win.webContents.send(KEYS.CONTENT_SIZE_CHANGED, [width, height])
                this.resizing = false
            }
        })
        this.win.loadURL(this.app.indexUrl + '/#/content').then(() => {
          if (this.app.openDevTools) {
              this.win.webContents.openDevTools()
          }
        })
    }
}
