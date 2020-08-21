import { BaiduTranslate } from '@/constant/Constants'
import md5 from 'md5'
import store from '@/store/index'
import LangMapper from '@/utils/LangMapper'
import conf from '@/config/Conf'

export class BaiduTranslateReq {
  private q: string
  private from: string
  private to : string
  private salt: string
  private sign: string
  private appid: string
  constructor(q: string) {
    this.q = q
    this.from = LangMapper.toBaiduTranslate(store.state.translate.source)
    this.to = LangMapper.toBaiduTranslate(store.state.translate.target)
    this.salt = (Date.now() << 2).toString()
    this.appid = conf.translate.get('baiduTransAppId')
    const appSecret = conf.translate.get('baiduTransSecret')
    this.sign = md5(`${this.appid}${q}${this.salt}${appSecret}`).toLowerCase()
  }
}
