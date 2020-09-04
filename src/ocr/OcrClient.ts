import axios, { AxiosResponse } from 'axios'
import store from '@/store/index'
import { BaiduTranslateReq } from '@/network/request/TranslateReq'
import { BaiduTranslateResp } from '@/network/response/TranslateResp'
import { Mutations } from '@/constant/Constants'
import qs from 'qs'
import { BaiduOcrReq } from '@/network/request/OcrReq'
import LangMapper from '../utils/LangMapper'
import { BaiduOcrError, BaiduOcrResult } from '@/network/response/OcrResp'
import conf from '@/config/Conf'
import DateUtil from '@/utils/DateUtil'
import { BaiduTokenReq } from '@/network/request/BaiduTokenReq'
import { BaiduToken, BaiduTokenError, BaiduTokenErrorCode } from '@/network/response/BaiduToken'
import { compareTwoStrings } from 'string-similarity'
import { awaitTo, ResponseWrapper } from '@/utils/NetExt'
import { remote, ipcRenderer } from 'electron'
import CaptureManager from '@/ocr/CaptureManager'
import { KEYS } from '@/electron/event/IPC'

/**
 * 文字识别
 */
export class OcrClient {
  private static client: OcrClient
  // scheduler: Scheduler | null = null
  private recognizeText = ''
  private resultText = ''

  static getInstance() {
    if (this.client == null) {
      this.client = new OcrClient()
    }
    return this.client
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
    // token过期就请求百度api token
    let token = conf.translate.get('baiduToken')
    if (token == null || !DateUtil.tokenValid(token.expires_in, token.create_time)) {
      const req = qs.stringify(new BaiduTokenReq())
      const {data, err} = await awaitTo<BaiduToken, BaiduTokenError>(axios.post(
        `https://aip.baidubce.com/oauth/2.0/token?${req}`
      ))
      if (!data) {
        if (err) {
          if (err.error === BaiduTokenErrorCode.invalid_client) {
            // appid 或者 secrect 错误
            // CaptureManager.getInstance().stop()
            const notification = new remote.Notification({
              title: '认证失败',
              body: '百度OCR AppId或AppSecret不正确！点击设置',
              silent: false,
              timeoutType: 'default'
            })
            notification.on('click', () => {
              ipcRenderer.send(KEYS.MAIN_PROXY, KEYS.ROUTE_API_CONFIG)
            })
            notification.show()
          }
        }
        return
      }
      token = data
      token.create_time = Date.now()
      conf.translate.set('baiduToken', token)
    }
    // ocr识别图片中文字
    const source = conf.translate.get('source')
    const lang = LangMapper.toBaiduOcr(source)
    const img = base64.split(',')[1]
    let req = new BaiduOcrReq(img)
    if (lang !== LangMapper.AUTO) {
      req = new BaiduOcrReq(img, lang)
    }
    const {data, err} = await awaitTo<BaiduOcrResult, BaiduOcrError>(axios.post(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token.access_token}`,
      qs.stringify(req),
      {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      }))
    if (!data) {
      err?.error_code
      return
    }
    if (data.words_result.length === 0) {
      return
    }
    console.log(`lines: ${JSON.stringify(data.words_result)}`)
    const text = data.words_result.map(v => v.words).reduce((prev, current) => `${prev} ${current}`)
    if (text.trim().length > 2) {
      const similarity = compareTwoStrings(text, this.recognizeText)
      console.log(`similarity:${similarity}, last: ${this.recognizeText}, current${text}`)
      // 相似度太高的语句不翻译
      if (similarity < 0.65) {
        this.recognizeText = text
        const cancel = axios.CancelToken.source()
        const resp: AxiosResponse<BaiduTranslateResp> = await axios.get(
          'http://api.fanyi.baidu.com/api/trans/vip/translate',
          {
            params: new BaiduTranslateReq(text),
            cancelToken: cancel.token
          })
        const data = resp.data
        if (!data.error_code) {
          if (data.trans_result && data.trans_result.length > 0) {
            const src = data.trans_result[0].src
            const dst = data.trans_result[0].dst
            this.resultText = dst
            store.commit(Mutations.MUTATION_RESULT_TEXT, dst)
          }
        } else {
        }
      }
    }
  }
}
