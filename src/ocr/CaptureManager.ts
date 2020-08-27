import { desktopCapturer, ipcRenderer, Display, remote, BrowserWindow } from 'electron'
import { Rect } from '@/graphics/Graphics'
import { OcrClient } from './OcrClient'
import conf from '../config/Conf'
import { IPC } from '@/constant/Constants'
import { MainLog } from '@/utils/MainLog'
import { DModel } from 'win32-api'

declare const __static: string
export default class CaptureManager {
  videoStream: MediaStream | null = null
  capturing = false
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
    const source = conf.temp.get('source')
    if (source) {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: ({
          // width: 1280,
          // height: 720,
          // deviceId: source.id,
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.sourceId,
            minWidth: source.width,
            maxWidth: source.width,
            minHeight: source.height,
            maxHeight: source.height
          }
        } as any)
      })
        .then(stream => {
          this.startCaptureImage(stream)
        })
        .catch(err => console.log('capture', err))
    }
  }

  /**
   *
   * @param stream 捕获屏幕截图
   */
  async startCaptureImage(stream: MediaStream) {
    this.videoStream = stream
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    let ctx: CanvasRenderingContext2D | null
    if (canvas != null) {
      ctx = canvas.getContext('2d')
    }
    video.srcObject = stream
    video.onloadedmetadata = async () => {
      await video.play()
      this.timer = window.setInterval(async () => {
        // 截取屏幕图片
        const rect: Rect | null = conf.temp.get('captureRect')
        if (rect != null) {
          // canvas.height = rect.bottom - rect.top
          // canvas.width = rect.right - rect.left
          const width = rect.right - rect.left
          const height = rect.bottom - rect.top
          canvas.height = rect.bottom - rect.top
          canvas.width = rect.right - rect.left
          const bm = await createImageBitmap(video, rect.left, rect.top, width, height)
          if (ctx != null) {
            ctx.drawImage(bm, 0, 0, width, height)
            const base64 = canvas.toDataURL('image/jpeg')
            bm.close()
            await OcrClient.getInstance().recognize(base64)
          }
        }
      }, 600)
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
