import conf from '@/config/Conf'
import { Platform, Urls } from '@/constant/Constants'
import { axiosTask, task } from '@/utils/NetExt'
import { BaiduTranslateErrorCode, BaiduTranslateResp } from '@/network/response/TranslateResp'
import axios from 'axios'
import { BaiduTranslateReq } from '@/network/request/TranslateReq'
import { MainLog } from '@/utils/MainLog'
import NotificationUtil from '@/utils/NotificationUtil'
import { tmt } from 'tencentcloud-sdk-nodejs'
import LangMapper from '@/utils/LangMapper'
import { TxTranslateResp } from '@/network/response/TxResp'

const TmtClient = tmt.v20180321.Client

/**
 * 翻译api
 */
export default class Api {

  private static lastNotifyTime = 0

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
   * @private
   */
  private static showTips(title: string, text: string) {
    const current = Date.now()
    if (current - this.lastNotifyTime > 1000 * 60) {
      if (text.length > 0) {
        NotificationUtil.showSimple(title, text)
      }
      this.lastNotifyTime = current
    }
  }
}
