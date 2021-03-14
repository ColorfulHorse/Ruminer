import store from '@/store/index'
import { Mutations } from '@/constant/Constants'
import { compareTwoStrings } from 'string-similarity'
import { ipcRenderer } from 'electron'
import { KEYS } from '@/electron/event/IPC'
import { MainLog } from '@/utils/MainLog'
import Api from '@/ocr/Api'

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

  async start() {
    if (!this.running) {
      MainLog.info('开启本地ocr')
      const ret = await ipcRenderer.invoke(KEYS.OCR_INIT)
      this.running = true
      return ret
    }
    return null
  }

  async stop() {
    if (this.running) {
      MainLog.info('关闭本地ocr')
      await ipcRenderer.send(KEYS.OCR_DESTROY)
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
    let text = ''
    if (this.running) {
      // 本地ocr
      text = await ipcRenderer.invoke(KEYS.OCR_RECOGNIZE, img)
    } else {
      // 百度ocr
      text = await Api.recognize(img)
    }
    // MainLog.info(`ocr text: ${text}`)
    if (text.trim().length > 2) {
      const similarity = compareTwoStrings(text, this.recognizeText)
      // console.log(`similarity:${similarity}, last: ${this.recognizeText}, current${text}`)
      // 相似度太高的语句不翻译
      if (similarity < 0.85) {
        this.recognizeText = text
        const result = await Api.translate(text)
        if (result.length > 0) {
          this.resultText = result
          store.commit(Mutations.MUTATION_RESULT_TEXT, result)
        }
      }
    }
  }
}
