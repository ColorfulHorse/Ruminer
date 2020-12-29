import conf from '@/config/Conf'
import { Mutations, Platform, Urls } from '@/constant/Constants'
import { axiosTask, task } from '@/utils/NetExt'
import { BaiduTranslateErrorCode, BaiduTranslateResp } from '@/network/response/TranslateResp'
import axios from 'axios'
import { BaiduTranslateReq } from '@/network/request/TranslateReq'
import { MainLog } from '@/utils/MainLog'
import NotificationUtil from '@/utils/NotificationUtil'
import { tmt } from 'tencentcloud-sdk-nodejs'
import LangMapper from '@/utils/LangMapper'
import { TxTranslateResp } from '@/network/response/TxResp'
import DateUtil from '@/utils/DateUtil'
import qs from 'qs'
import { BaiduTokenReq } from '@/network/request/BaiduTokenReq'
import { BaiduToken, BaiduTokenError, BaiduTokenErrorCode } from '@/network/response/BaiduToken'
import { ipcRenderer } from 'electron'
import { KEYS } from '@/electron/event/IPC'
import { BaiduOcrReq } from '@/network/request/OcrReq'
import { BaiduOcrError, BaiduOcrErrorCode, BaiduOcrResult } from '@/network/response/OcrResp'
import { compareTwoStrings } from 'string-similarity'
import store from '@/store'

const TmtClient = tmt.v20180321.Client

/**
 * 翻译api
 */
export default class Api {

  private static lastNotifyTime = 0

  /**
   * 百度ocr
   * @param base64
   */
  static async recognize(base64: string): Promise<string> {
    // token过期就请求百度api token
    let token = conf.translate.get('baiduToken')
    if (token == null || !DateUtil.tokenValid(token.expires_in, token.create_time)) {
      const req = qs.stringify(new BaiduTokenReq())
      const {data, err} = await axiosTask<BaiduToken, BaiduTokenError>(axios.post(
        `https://aip.baidubce.com/oauth/2.0/token?${req}`
      ))
      if (!data) {
        if (err) {
          if (err?.data?.error === BaiduTokenErrorCode.invalid_client) {
            // appid 或者 secrect 错误
            this.showTips('认证失败', '百度OCR AppId或AppSecret不正确！点击设置', () => {
              ipcRenderer.send(KEYS.MAIN_PROXY, KEYS.ROUTE_API_CONFIG)
            })
          }
        }
        return ''
      }
      token = data
      token.create_time = Date.now()
      conf.translate.set('baiduToken', token)
    }
    // ocr识别图片中文字
    const source = conf.translate.get('source')
    const lang = LangMapper.toBaiduOcr(source)
    let req = new BaiduOcrReq(base64)
    if (lang !== LangMapper.AUTO) {
      req = new BaiduOcrReq(base64, lang)
    }
    const {data, err} = await axiosTask<BaiduOcrResult, BaiduOcrError>(axios.post(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token.access_token}`,
      qs.stringify(req),
      {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      }))

    if (!data) {
      if (err?.data) {
        this.handleOcrError(err.data)
      }
      return ''
    }
    if (data.words_result.length === 0) {
      return ''
    }
    console.log(`lines: ${JSON.stringify(data.words_result)}`)
    return data.words_result.map(v => v.words).reduce((prev, current) => `${prev} ${current}`)
  }

  static handleOcrError(err: BaiduOcrError) {
    let title = ''
    let body = ''
    switch (err.error_code) {
      case BaiduOcrErrorCode.DAY_ZERO:
        title = '百度ocr当天次数用尽'
        body = '百度ocr当天次数用尽，请切换其他方式'
        break
      case BaiduOcrErrorCode.ALL_ZERO:
        title = '百度ocr所有次数用尽'
        body = '百度ocr所有次数用尽，请切换其他方式'
        break
      case BaiduOcrErrorCode.SIZE_ERROR:
        title = '识别区域太大'
        body = '选择识别区域过大，请重新选择'
        break
      case BaiduOcrErrorCode.INVALID_TOKEN:
        title = '百度ocr认证失败'
        body = '百度ocr认证失败，请检查appId和Secret是否正确'
        break
    }
    this.showTips(title, body)
  }

  static async translate(text: string): Promise<string> {
    const platform = conf.translate.get('platform')
    switch (platform) {
      case Platform.baidu:
        return this.baidu(text)
        break
      case Platform.tencent:
        return this.tencent(text)
        break
    }
    return ''
  }

  /**
   * 百度翻译
   * @param text
   * @private
   */
  private static async baidu(text: string): Promise<string> {
    const {data} = await axiosTask<BaiduTranslateResp>(axios.get(
      Urls.baiduTranslate,
      {
        params: new BaiduTranslateReq(text)
      }))
    if (data) {
      if (!data.error_code) {
        if (data.trans_result && data.trans_result.length > 0) {
          const src = data.trans_result[0].src
          const dst = data.trans_result[0].dst
          return dst
        }
      } else {
        this.handleBaiduError(data.error_code)
      }
    } else {
      MainLog.info('skip translate')
    }
    return ''
  }

  private static handleBaiduError(code: number) {
    const title = '百度翻译api出现错误'
    let body = ''
    switch (code) {
      case BaiduTranslateErrorCode.BALANCE_OVER:
        body = '百度翻译次数已用完，请使用其他方式'
        break
      case BaiduTranslateErrorCode.AUTH_FAILED:
        body = '百度翻译账户认证未通过，请到控制台查看进度'
        break
      case BaiduTranslateErrorCode.INVALID_ACCESS:
        body = '百度翻译授权失败，请检查appId是否正确，服务是否已开通'
        break
      case BaiduTranslateErrorCode.IP_LOCKED:
        body = '由于同一IP当日使用了多个百度翻译账号，IP被封禁，次日解封'
        break
    }
    this.showTips(title, body)
  }

  /**
   * 腾讯翻译
   * @param text
   * @private
   */
  private static async tencent(text: string): Promise<string> {
    const from = LangMapper.getLang(conf.translate.get('source')).tencent
    const to = LangMapper.getLang(conf.translate.get('target')).tencent
    const secretId = conf.translate.get('tencentSecretId')
    const secretKey = conf.translate.get('tencentSecretKey')
    const clientConfig = {
      credential: {
        secretId: secretId,
        secretKey: secretKey
      },
      region: 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: 'tmt.tencentcloudapi.com'
        }
      }
    }
    const client = new TmtClient(clientConfig)
    const params = {
      Source: from,
      SourceText: text,
      Target: to,
      ProjectId: 0
    }
    const {data} = await task<TxTranslateResp>(client.TextTranslate(params))
    if (data) {
      if (data.Error) {
        this.showTips('腾讯翻译api出现错误', data.Error.Message)
      } else {
        return data?.TargetText ?? ''
      }
    }
    return ''
  }

  /**
   * 错误通知
   * @param title
   * @param text
   * @param click
   * @private
   */
  private static showTips(title: string, text: string, click?: () => void) {
    const current = Date.now()
    if (current - this.lastNotifyTime > 1000 * 60) {
      if (text.length > 0) {
        NotificationUtil.showSimple(title, text, click)
      }
      this.lastNotifyTime = current
    }
  }
}
