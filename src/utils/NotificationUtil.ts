import { remote, Notification } from 'electron'
import path from "path"

export default class NotificationUtil {
  static showSimple(title: string, body: string, click?: () => void) {
    const Notify = process.type === 'renderer' ? remote.Notification : Notification
    const notification = new Notify({
      title: title,
      body: body,
      icon: path.join(__static, './logo.png'),
      silent: false,
      timeoutType: 'default'
    })
    if (click) {
      notification.on('click', () => {
        click()
      })
    }
    notification.show()
  }
}
