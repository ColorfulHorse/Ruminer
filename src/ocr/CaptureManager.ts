import { desktopCapturer, remote } from 'electron'
import { Rect } from '../graphics/Graphics'
import { StoreKey, Mutations } from '../constant/Constants'
import Store from 'electron-store'
import path from 'path'
import { OcrClient } from './OcrClient'
import store from '../store/index'

declare const __static: string
export default class CaptureManager {
  videoStream: MediaStream | null = null
  capturing = false
  electronStore = new Store()
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
  async start() {
    if (this.capturing) {
      return
    }
    const rect: Rect | null = this.electronStore.get(StoreKey.CAPTURE_RECT, null)
    if (rect != null) {
      await OcrClient.getInstance().init()
      this.capturing = true
      const { width, height } = remote.screen.getPrimaryDisplay().bounds
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

  /**
   *
   * @param stream 捕获屏幕截图
   */
  async startCaptureImage(stream: MediaStream) {
    console.log(process.env.BASE_URL)
    this.videoStream = stream
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
        const rect: Rect | null = this.electronStore.get(StoreKey.CAPTURE_RECT, null)
        if (rect != null) {
          canvas.height = rect.bottom - rect.top
          canvas.width = rect.right - rect.left
          console.log(rect)
          const bm = await createImageBitmap(video, rect.left, rect.top, rect.right, rect.bottom)
          if (ctx != null) {
            ctx.drawImage(bm, 0, 0, rect.right, rect.bottom)
            const base64 = canvas.toDataURL('image/jpeg')
            bm.close()
            const res = await OcrClient.getInstance().recognize(base64)
            store.commit(Mutations.MUTATION_RESULT_TEXT, res.data.text)
          }
        }
      }, 200)
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
