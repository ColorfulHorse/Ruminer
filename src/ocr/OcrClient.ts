import { Scheduler, createScheduler, createWorker, RecognizeResult } from 'tesseract.js'

/**
 * 文字识别
 */
export class OcrClient {
  private static client: OcrClient
  scheduler: Scheduler | null = null

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
          const progress = m.progress
          const status = m.status
          console.log('progress:' + progress + '---status:' + status)
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
   *
   * @param base64 识别图片
   */
  async recognize(base64: string) {
    if (this.scheduler) {
      return await this.scheduler.addJob('recognize', base64) as RecognizeResult
    }
    throw new Error('scheduler not create')
  }
}
