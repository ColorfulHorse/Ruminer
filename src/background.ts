'use strict'

import { app, protocol, Menu, Tray, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import { stringify } from "querystring";
import { IPC } from './constant/Constants'


const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])

function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    maximizable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION)
    }
  })
  Menu.setApplicationMenu(null)
  win.on('close', (event) => {
    if (win != null) {
      win.hide();
      win.setSkipTaskbar(true);
    }
    event.preventDefault();
  })

  // win.on('show', () => {
  //   tray?.setHighlightMode('always')
  // })
  // win.on('hide', () => {
  //   tray?.setHighlightMode('never')
  // });
  // win.on('hide', () => {
  //   tray?.setHighlightMode('never')
  // })
  //
  // let tray: Tray | null
  // //创建系统通知区菜单
  // tray = new Tray(path.join(__dirname, '/assets/logo.png'));
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: '退出', click: () => {
  //       win.destroy()
  //     }
  //   },//我们需要在这里有一个真正的退出（这里直接强制退出）
  // ])
  // tray.setToolTip('My托盘测试')
  // // tray.setContextMenu(contextMenu)
  // tray.on('click', () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
  //   if (win != null) {
  //     win!.isVisible() ? win.hide() : win.show()
  //     win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
  //   }
  // })
  let indexUrl: string
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    indexUrl = process.env.WEBPACK_DEV_SERVER_URL as string
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    indexUrl = 'app://./index.html'
  }
  win.loadURL(indexUrl)

  win.on('closed', () => {
    win = null
  })

  ipcMain.on(IPC.OPEN_DEVTOOL, () => {
    if (!process.env.IS_TEST) {
      if (win != null) {
        win.webContents.openDevTools()
      }
    }
  })

  ipcMain.on(IPC.SELECT_AREA, () => {
    if (!process.env.IS_TEST) {
      let window = new BrowserWindow({
        maximizable: true,
        fullscreen: true,
        frame: false
      })
      window.loadURL(indexUrl + '/#/overlay')
      window.webContents.openDevTools()
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
