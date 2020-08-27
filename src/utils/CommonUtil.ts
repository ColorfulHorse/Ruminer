import conf from '@/config/Conf'
import { Notification } from "electron"
import App from '@/electron/App'
import { IPC } from '@/constant/Constants'

export default class CommonUtil {
  /**
   * 检查必要配置是否存在
   */
  static checkConfig(app: App): boolean {
    const ocrApiKey = conf.translate.get('baiduOcrApiKey')
    const ocrSecret = conf.translate.get('baiduOcrSecret')
    const translateId = conf.translate.get('baiduTransAppId')
    const translateSecret = conf.translate.get('baiduTransSecret')
    if (ocrApiKey.length == 0 || ocrSecret.length == 0 || translateId.length == 0 || translateSecret.length == 0) {
      const notification = new Notification({
        title: 'api 设置',
        body: 'api key 未设置，无法正常使用，点击设置',
        silent: false,
        timeoutType: 'default'
      })
      notification.on('click', () => {
        if (app.mainWin != null) {
          app.mainWin.win.webContents.send(IPC.ROUTE_API_CONFIG)
          app.showMain()
        }
      })
      notification.show()
      return false
    }
    return true
  }
}
