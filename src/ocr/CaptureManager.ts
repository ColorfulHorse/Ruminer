import { desktopCapturer, remote } from 'electron'
import { Rect } from '../graphics/Graphics'
import { StoreKey } from '../constant/Constants'
import Store from 'electron-store'
import { Scheduler, createScheduler, createWorker, RecognizeResult } from 'tesseract.js'
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
    const rect: Rect | null = this.store.get(StoreKey.CAPTURE_RECT, null)
    if (rect != null) {
      this.capturing = true
      const { width, height } = remote.screen.getPrimaryDisplay().workArea
      desktopCapturer.getSources({ types: ['screen'] })
        .then(sources => {
          sources.forEach(source => {
            const stream = navigator.mediaDevices.getUserMedia({
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

  // startCaptureImage(stream: MediaStream, rect: Rect) {
  //   this.videoStream = stream
  //   const video = document.createElement('video')
  //   const canvas = document.createElement('canvas')
  //   let ctx: CanvasRenderingContext2D | null
  //   if (canvas != null) {
  //     ctx = canvas.getContext('2d')
  //   }
  //   video.srcObject = stream
  //   video.onloadedmetadata = () => {
  //     video.play()
  //     this.timer = window.setInterval(async () => {
  //       const bm = await createImageBitmap(video, rect.left, rect.top, rect.right, rect.bottom)
  //       if (ctx != null) {
  //         ctx.drawImage(bm, 0, 0, rect.right, rect.bottom)
  //         const base64 = canvas.toDataURL('image/jpeg')
  //         bm.close()
  //         const res = await OcrClient.getOcr().generalBasic(base64, {})
  //         res.error_code
  //       }
  //     }, 100);
  //   }
  // }

  async startCaptureImage(stream: MediaStream) {
    this.videoStream = stream
    this.scheduler = createScheduler()
    const worker = createWorker({
      workerBlobURL: false,
      errorHandler: (err) => {
        const s = err
      }
    })
    await worker.load()
    await worker.loadLanguage('eng+jpn')
    await worker.initialize('eng+jpn')
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
