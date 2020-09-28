import axios, { AxiosResponse } from 'axios'
import store from '@/store/index'
import { BaiduTranslateReq } from '@/network/request/TranslateReq'
import { BaiduTranslateErrorCode, BaiduTranslateResp } from '@/network/response/TranslateResp'
import { Mutations } from '@/constant/Constants'
import qs from 'qs'
import { BaiduOcrReq } from '@/network/request/OcrReq'
import LangMapper from '../utils/LangMapper'
import { BaiduOcrError, BaiduOcrErrorCode, BaiduOcrResult } from '@/network/response/OcrResp'
import conf from '@/config/Conf'
import DateUtil from '@/utils/DateUtil'
import { BaiduTokenReq } from '@/network/request/BaiduTokenReq'
import { BaiduToken, BaiduTokenError, BaiduTokenErrorCode } from '@/network/response/BaiduToken'
import { compareTwoStrings } from 'string-similarity'
import { awaitTo, ResponseWrapper } from '@/utils/NetExt'
import { remote, ipcRenderer, Notification } from 'electron'
import CaptureManager from '@/ocr/CaptureManager'
import { KEYS } from '@/electron/event/IPC'
import NotificationUtil from '@/utils/NotificationUtil'
import path from 'path'
import { MainLog } from '@/utils/MainLog'

/**
 * 文字识别
 */
export class OcrClient {
  private static client: OcrClient
  // scheduler: Scheduler | null = null
  private recognizeText = ''
  private resultText = ''
  private lastNotifyTime = 0
  private running = false

  static getInstance() {
    if (this.client == null) {
      this.client = new OcrClient()
    }
    return this.client
  }

  start() {
    if (!this.running) {
      this.running = true
      return ipcRenderer.invoke(KEYS.OCR_INIT)
    }
    return null
  }

  stop() {
    if (this.running) {
      ipcRenderer.send(KEYS.OCR_DESTROY)
      this.running = false
    }
  }

  // async init() {
  //   if (this.scheduler == null) {
  //     this.scheduler = createScheduler()
  //     const worker = createWorker({
  //       logger: m => {
  //         // const progress = m.progress
  //         // const status = m.status
  //         // console.log('progress:' + progress + '---status:' + status)
  //       },
  //       errorHandler: err => {
  //         console.log(err)
  //       },
  //       cacheMethod: 'none',
  //       langPath: window.location.origin + '/tess',
  //       corePath: window.location.origin + '/tess/tesseract-core.wasm.js',
  //       workerPath: window.location.origin + '/tess/worker.min.js'
  //     })
  //     await worker.load()
  //     await worker.loadLanguage('eng')
  //     await worker.initialize('eng')
  //     this.scheduler.addWorker(worker)
  //   }
  // }

  /**
   * @param base64 识别图片
   */
  async recognize(base64: string) {
    const img = base64.split(',')[1]
    const text = await ipcRenderer.invoke(KEYS.OCR_RECOGNIZE, img)
    MainLog.info(`ocr text: ${text}`)
    if (text.trim().length > 2) {
      const similarity = compareTwoStrings(text, this.recognizeText)
      console.log(`similarity:${similarity}, last: ${this.recognizeText}, current${text}`)
      // 相似度太高的语句不翻译
      if (similarity < 1) {
        this.recognizeText = text
        const cancel = axios.CancelToken.source()
        const {data, err} = await awaitTo<BaiduTranslateResp, BaiduTranslateResp>(axios.get(
          'http://api.fanyi.baidu.com/api/trans/vip/translate',
          {
            params: new BaiduTranslateReq(text),
            cancelToken: cancel.token
          }))
        if (data) {
          if (!data.error_code) {
            if (data.trans_result && data.trans_result.length > 0) {
              const src = data.trans_result[0].src
              const dst = data.trans_result[0].dst
              this.resultText = dst
              store.commit(Mutations.MUTATION_RESULT_TEXT, dst)
            }
          } else {
            this.handleTranslateError(data.error_code)
          }
        }
      } else {
        MainLog.info('skip translate')
      }
    }
  }

  // /**
  //  * @param base64 识别图片
  //  */
  // async recognize(base64: string) {
  //   // token过期就请求百度api token
  //   let token = conf.translate.get('baiduToken')
  //   if (token == null || !DateUtil.tokenValid(token.expires_in, token.create_time)) {
  //     const req = qs.stringify(new BaiduTokenReq())
  //     const {data, err} = await awaitTo<BaiduToken, BaiduTokenError>(axios.post(
  //       `https://aip.baidubce.com/oauth/2.0/token?${req}`
  //     ))
  //     if (!data) {
  //       if (err) {
  //         if (err.error === BaiduTokenErrorCode.invalid_client) {
  //           // appid 或者 secrect 错误
  //           // CaptureManager.getInstance().stop()
  //           const notification = new remote.Notification({
  //             title: '认证失败',
  //             body: '百度OCR AppId或AppSecret不正确！点击设置',
  //             silent: false,
  //             timeoutType: 'default'
  //           })
  //           notification.on('click', () => {
  //             ipcRenderer.send(KEYS.MAIN_PROXY, KEYS.ROUTE_API_CONFIG)
  //           })
  //           notification.show()
  //         }
  //       }
  //       return
  //     }
  //     token = data
  //     token.create_time = Date.now()
  //     conf.translate.set('baiduToken', token)
  //   }
  //   // ocr识别图片中文字
  //   const source = conf.translate.get('source')
  //   const lang = LangMapper.toBaiduOcr(source)
  //   const img = base64.split(',')[1]
  //   let req = new BaiduOcrReq(img)
  //   if (lang !== LangMapper.AUTO) {
  //     req = new BaiduOcrReq(img, lang)
  //   }
  //   const {data, err} = await awaitTo<BaiduOcrResult, BaiduOcrError>(axios.post(
  //     `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token.access_token}`,
  //     qs.stringify(req),
  //     {
  //       headers: {'content-type': 'application/x-www-form-urlencoded'}
  //     }))
  //
  //   if (!data) {
  //     if (err) {
  //       this.handleOcrError(err)
  //     }
  //     return
  //   }
  //   if (data.words_result.length === 0) {
  //     return
  //   }
  //   console.log(`lines: ${JSON.stringify(data.words_result)}`)
  //   const text = data.words_result.map(v => v.words).reduce((prev, current) => `${prev} ${current}`)
  //   if (text.trim().length > 2) {
  //     const similarity = compareTwoStrings(text, this.recognizeText)
  //     console.log(`similarity:${similarity}, last: ${this.recognizeText}, current${text}`)
  //     // 相似度太高的语句不翻译
  //     if (similarity < 0.65) {
  //       this.recognizeText = text
  //       const cancel = axios.CancelToken.source()
  //       const {data, err} = await awaitTo<BaiduTranslateResp, BaiduTranslateResp>(axios.get(
  //         'http://api.fanyi.baidu.com/api/trans/vip/translate',
  //         {
  //           params: new BaiduTranslateReq(text),
  //           cancelToken: cancel.token
  //         }))
  //       if (data) {
  //         if (!data.error_code) {
  //           if (data.trans_result && data.trans_result.length > 0) {
  //             const src = data.trans_result[0].src
  //             const dst = data.trans_result[0].dst
  //             this.resultText = dst
  //             store.commit(Mutations.MUTATION_RESULT_TEXT, dst)
  //           }
  //         } else {
  //           this.handleTranslateError(data.error_code)
  //         }
  //       }
  //     }
  //   }
  // }

  handleOcrError(err: BaiduOcrError) {
    const current = Date.now()
    if (current - this.lastNotifyTime > 1000 * 60) {
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
      if (title.length > 0) {
        NotificationUtil.showSimple(title, body)
      }
      this.lastNotifyTime = current
    }
  }

  handleTranslateError(code: number) {
    const current = Date.now()
    if (current - this.lastNotifyTime > 1000 * 60) {
      let title = ''
      let body = ''
      switch (code) {
        case BaiduTranslateErrorCode.BALANCE_OVER:
          title = '账户余额不足'
          body = '百度翻译次数已用完，请使用其他方式'
          break
        case BaiduTranslateErrorCode.AUTH_FAILED:
          title = '账户认证未通过'
          body = '百度翻译账户认证未通过，请到控制台查看进度'
          break
        case BaiduTranslateErrorCode.INVALID_ACCESS:
          title = '用户未授权'
          body = '百度翻译授权失败，请检查appId是否正确，服务是否已开通'
          break
        case BaiduTranslateErrorCode.IP_LOCKED:
          title = 'IP已被锁定'
          body = '由于同一IP当日使用了多个百度翻译账号，IP被封禁，次日解封'
          break
      }
      if (title.length > 0) {
        NotificationUtil.showSimple(title, body)
      }
      this.lastNotifyTime = current
    }
  }
}
