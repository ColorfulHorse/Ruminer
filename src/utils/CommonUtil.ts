import conf from '@/config/Conf'
import { Platform } from '@/constant/Constants'

export default class CommonUtil {
  /**
   * 检查必要配置是否存在
   */
  static checkConfig(): boolean {
    const platform = conf.translate.get('platform')
    let ok = false
    switch (platform) {
      case Platform.baidu: {
        const translateId = conf.translate.get('baiduTransAppId')
        const translateSecret = conf.translate.get('baiduTransSecret')
        ok = !(translateId.length === 0 || translateSecret.length === 0)
      }
        break
      case Platform.tencent: {
        const txId = conf.translate.get('tencentSecretId')
        const txKey = conf.translate.get('tencentSecretKey')
        ok = txId.length > 0 && txKey.length > 0
      }
        break
      default:
        break
    }
    return ok
  }
}
