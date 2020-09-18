import { Rect } from '@/graphics/Graphics'
import { OcrClient } from './OcrClient'
import conf, { MediaSource } from '../config/Conf'
import { MainLog } from '@/utils/MainLog'
import NotificationUtil from '@/utils/NotificationUtil'

export default class CaptureManager {
  videoStream: MediaStream | null = null
  capturing = false
  timer = -1
  mediaSource: MediaSource | null = null

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
    if (this.capturing) {
      return
    }
    OcrClient.getInstance().start()
    this.capturing = true
    MainLog.info('start capturing')
    const source = conf.temp.get('source')
    if (source) {
      this.mediaSource = source
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
        .catch(err => {
          this.showError()
          this.stop()
        })
    }
  }

  /**
   * 选择窗口改变后需要重启
   */
  restart() {
    if (this.capturing) {
      const source = conf.temp.get('source')
      if (this.mediaSource && source) {
        if (this.mediaSource.mode !== source.mode || this.mediaSource.sourceId !== source.sourceId) {
          MainLog.info(`restart capture, mode:${source.mode}, id: ${source.sourceId}`)
          this.stop()
          this.start()
        }
      }
    }
  }

  /**
   *
   * @param stream 捕获屏幕截图
   */
  startCaptureImage(stream: MediaStream) {
    this.videoStream = stream
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    let ctx: CanvasRenderingContext2D | null
    if (canvas != null) {
      ctx = canvas.getContext('2d')
    }
    video.srcObject = stream
    video.onloadedmetadata = async () => {
      video.play().then(() => {
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
      }).catch(err => {
        this.showError()
        this.stop()
      })
    }
  }

  stop() {
    if (this.capturing) {
      MainLog.info('stop capture')
    }
    OcrClient.getInstance().stop()
    this.capturing = false
    if (this.timer !== -1) {
      window.clearInterval(this.timer)
      this.timer = -1
    }
    if (this.videoStream != null) {
      this.videoStream.getVideoTracks().forEach(value => value.stop())
      this.videoStream = null
    }
  }

  showError() {
    NotificationUtil.showSimple('读取屏幕内容错误', '读取屏幕或窗口内容错误，窗口可能已经被关闭，请重试')
  }
}
