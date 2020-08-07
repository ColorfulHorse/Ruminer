import conf from '@/config/Conf'

export class BaiduTokenReq {
  private grant_type = 'client_credentials'
  private client_id: string
  private client_secret: string

  constructor() {
    this.client_id = conf.translate.get('baiduOcrApiKey')
    this.client_secret = conf.translate.get('baiduTransSecret')
  }
}
