import { desktopCapturer, remote } from 'electron'
import { Rect } from '../graphics/Graphics'
import { Capture } from '../constant/Constants'

class CaptureManager {
  static start() {
    const { width, height } = remote.screen.getPrimaryDisplay().workArea
    desktopCapturer.getSources({types: ['window']})
      .then(async sources => {
        sources.forEach(source => {
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: (<any>{
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
            })
          })
            .then(stream => {
              const video = document.querySelector('video')
              if (video != null) {
                video.srcObject = stream
                video.onloadedmetadata = (event) => {
                  video.play()
                    const rect = Capture.RECT
                    if (rect != null) {
                      createImageBitmap(video, rect.left, rect.top, rect.right, rect.bottom).then(bm => {

                      })
                    }
                }
              }
            })
            .catch(err => console.log('capture', err))
        })
      })
  }
}
