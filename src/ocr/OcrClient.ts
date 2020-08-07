import { Scheduler, createScheduler, createWorker, RecognizeResult } from 'tesseract.js'
import axios, { AxiosResponse } from 'axios'
import store from '../store/index'
import { BaiduTranslateReq } from '../network/request/TranslateReq'
import { BaiduTranslateResp } from '../network/response/TranslateResp'
import { Mutations } from '../constant/Constants'


/**
 * 文字识别
 */
export class OcrClient {
  private static client: OcrClient
  scheduler: Scheduler | null = null
  private recognizeText = ''

  static getInstance() {
    if (this.client == null) {
      this.client = new OcrClient()
    }
    return this.client
  }

  async init() {
    if (this.scheduler == null) {
      this.scheduler = createScheduler()
      const worker = createWorker({
        logger: m => {
          // const progress = m.progress
          // const status = m.status
          // console.log('progress:' + progress + '---status:' + status)
        },
        errorHandler: err => {
          console.log(err)
        },
        cacheMethod: 'none',
        langPath: window.location.origin + '/tess',
        corePath: window.location.origin + '/tess/tesseract-core.wasm.js',
        workerPath: window.location.origin + '/tess/worker.min.js'
      })
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      this.scheduler.addWorker(worker)
    }
  }

  /**

   * @param base64 识别图片
   */
  async recognize(base64: string) {
    if (this.scheduler != null) {
      console.log(`recognize start time: ${new Date().getTime()}`)
      const res = await this.scheduler.addJob('recognize', base64) as RecognizeResult
      console.log(`recognize finish time: ${new Date().getTime()}`)
      if (res.data.text.trim().length > 2) {
        if (res.data.text !== this.recognizeText) {
          this.recognizeText = res.data.text
          const cancel = axios.CancelToken.source()
          try {
            const resp: AxiosResponse<BaiduTranslateResp> = await axios.get(
              '/baidu/api/trans/vip/translate',
              {
                params: new BaiduTranslateReq(res.data.text),
                cancelToken: cancel.token
              })
            // console.log(`translate time: ${new Date().getTime()}`)
            const data = resp.data
            if (!data.error_code) {
              if (data.trans_result && data.trans_result.length > 0) {
                const src = data.trans_result[0].src
                const dst = data.trans_result[0].dst
                console.log(`recognizeText:${this.recognizeText}, src:${src}, dst:${dst}`)
                store.commit(Mutations.MUTATION_RESULT_TEXT, dst)
              }
            } else {
              console.log(`error code: ${data.error_code}`)
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
    } else {
      throw new Error('scheduler not create')
    }
  }
}
