import { BaiduApi } from '../../constant/Constants'
import md5 from 'md5'
import store from '../../store/index'
import LangMapper from '../../utils/LangMapper'

export class BaiduTranslateReq {
  private q: string
  private from: string
  private to : string
  private salt: string
  private sign: string
  private appid: string
  constructor(q: string) {
    this.q = q
    this.from = LangMapper.toBaidu(store.state.translate.source)
    this.to = LangMapper.toBaidu(store.state.translate.target)
    this.salt = (Date.now() << 2).toString()
    this.appid = BaiduApi.APP_ID
    this.sign = md5(`${this.appid}${q}${this.salt}${BaiduApi.SECRET_KEY}`).toLowerCase()
  }
}
