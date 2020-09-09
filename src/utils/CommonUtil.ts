import conf from '@/config/Conf'

export default class CommonUtil {
  /**
   * 检查必要配置是否存在
   */
  static checkConfig(): boolean {
    const ocrApiKey = conf.translate.get('baiduOcrApiKey')
    const ocrSecret = conf.translate.get('baiduOcrSecret')
    const translateId = conf.translate.get('baiduTransAppId')
    const translateSecret = conf.translate.get('baiduTransSecret')
    return !(ocrApiKey.length === 0 || ocrSecret.length === 0 || translateId.length === 0 || translateSecret.length === 0)
  }
}
