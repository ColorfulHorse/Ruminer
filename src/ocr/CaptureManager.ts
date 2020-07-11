import { desktopCapturer, remote } from 'electron'
import { Rect } from '../graphics/Graphics'
import { StoreKey } from '../constant/Constants'
import Store from 'electron-store'
import { Scheduler, createScheduler, createWorker, RecognizeResult } from 'tesseract.js'
import path from 'path'

declare const __static: string
export class CaptureManager {
  videoStream: MediaStream | null = null
  scheduler: Scheduler | null = null
  capturing = false
  store = new Store()
  timer = -1

  private static _instance: CaptureManager

  private constructor() {
  }

  static getInstance() {
    if (this._instance == null) {
      this._instance = new CaptureManager()
    }
    return this._instance
  }

  // 开始捕捉屏幕
  start() {
    // (async () => {
    //   const worker = createWorker({
    //     logger: m => {
    //       const progress = m.progress
    //       const status = m.status
    //       console.log('progress:' + progress + '---status:' + status)
    //     },
    //     errorHandler: err => {
    //       console.log(err)
    //     },
    //     cacheMethod: 'none',
    //     gzip: false,
    //     workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
    //     langPath: window.location.origin + '/tess',
    //     corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js'
    //     // langPath: path.join(__static, '/tess'),
    //     // corePath: path.join(__static, '/tess/tesseract-core.wasm.js'),
    //     // workerPath: path.join(__static, '/tess/worker.min.js')
    //     // langPath: '/tess',
    //     // corePath: '/tess/tesseract-core.wasm.js',
    //     // workerPath: '/tess/worker.min.js'
    //     // // langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    //     // langPath: window.location.origin + '/tess',
    //     // corePath: window.location.origin + '/tess/tesseract-core.wasm.js',
    //     // workerPath: window.location.origin + '/tess/worker.min.js'
    //     // gzip: false
    //   })
    //   console.log(path.join(__static, '/tess'))
    //   await worker.load()
    //   await worker.loadLanguage('eng')
    //   await worker.initialize('eng')
    //   console.log('init ok')
    // })()
    const rect: Rect | null = this.store.get(StoreKey.CAPTURE_RECT, null)
    if (rect != null) {
      this.capturing = true
      const { width, height } = remote.screen.getPrimaryDisplay().workArea
      desktopCapturer.getSources({ types: ['screen'] })
        .then(sources => {
          sources.forEach(source => {
            navigator.mediaDevices.getUserMedia({
              audio: false,
              video: ({
                // width: 1280,
                // height: 720,
                // deviceId: source.id,
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: source.id,
                  minWidth: width,
                  maxWidth: width,
                  minHeight: height,
                  maxHeight: height
                }
              } as any)
            })
              .then(stream => {
                this.startCaptureImage(stream)
              })
              .catch(err => console.log('capture', err))
          })
        })
    }
  }

  async startCaptureImage(stream: MediaStream) {
    console.log(process.env.BASE_URL)

    this.videoStream = stream
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
      workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
      langPath: window.location.origin + '/tess',
      corePath: 'https://unpkg.com/tesseract.js-core@v2.2.0/tesseract-core.wasm.js'
      // langPath: path.join(__static, '/tess'),
      // corePath: path.join(__static, '/tess/tesseract-core.wasm.js'),
      // workerPath: path.join(__static, '/tess/worker.min.js')
      // langPath: '/tess',
      // corePath: '/tess/tesseract-core.wasm.js',
      // workerPath: '/tess/worker.min.js'
      // // langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      // langPath: window.location.origin + '/tess',
      // corePath: window.location.origin + '/tess/tesseract-core.wasm.js',
      // workerPath: window.location.origin + '/tess/worker.min.js'
      // gzip: false
    })
    console.log(path.join(__static, '/tess'))
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    console.log('init ok')
    this.scheduler.addWorker(worker)
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    let ctx: CanvasRenderingContext2D | null
    if (canvas != null) {
      ctx = canvas.getContext('2d')
    }
    video.srcObject = stream
    video.onloadedmetadata = () => {
      video.play()
      this.timer = window.setInterval(async () => {
        // 截取屏幕图片
        const rect: Rect | null = this.store.get(StoreKey.CAPTURE_RECT, null)
        if (rect != null) {
          const bm = await createImageBitmap(video, rect.left, rect.top, rect.right, rect.bottom)
          if (ctx != null) {
            ctx.drawImage(bm, 0, 0, rect.right, rect.bottom)
            const base64 = canvas.toDataURL('image/jpeg')
            bm.close()
            if (this.scheduler != null) {
              const res = await this.scheduler.addJob('recognize', base64) as RecognizeResult
              const str = res.data.text
            }
          }
        }
      }, 100)
    }
  }

  stop() {
    this.capturing = false
    if (this.timer !== -1) {
      window.clearInterval(this.timer)
    }
    if (this.videoStream != null) {
      this.videoStream.getVideoTracks()[0].stop()
      this.videoStream = null
    }
  }
}
