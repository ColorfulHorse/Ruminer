<template>
  <div id="root" ref="root" @mouseenter="enter" @mouseleave="leave">
    <div id="container" ref="container" :style="boxStyle">
      <div id="action_wrapper">
        <transition name="fade">
          <ul id="actions" v-if="inside">
            <li @click="capture"><i class="el-icon-scissors"/></li>
            <li @click="selectWindow"><i class="el-icon-windows"/></li>
            <li @click="minus"><i class="el-icon-minus"/></li>
            <li @click="plus"><i class="el-icon-plus"/></li>
            <li @click="close"><i class="el-icon-close"/></li>
          </ul>
        </transition>
      </div>
      <div id="content">
        <p :style="{ fontSize : (textSize + 'px') }">{{$store.state.translate.resultText}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { DesktopCapturerSource, ipcRenderer, remote } from 'electron'
import CaptureManager from '../ocr/CaptureManager'
import IPC, { KEYS } from '@/electron/event/IPC'
import { MainLog } from '@/utils/MainLog'

@Component({
  name: 'Content'
})
export default class Content extends Vue {
  textSize = 24

  inside = false

  dragging = false
  wX = -1
  wY = -1
  screenX = -1
  screenY = -1
  winWidth = 0
  winHeight = 0

  mounted() {
    ipcRenderer.invoke(KEYS.GET_CONTENT_SIZE).then((size: number[]) => {
      this.winWidth = size[0]
      this.winHeight = size[1]
      MainLog.info(`original: ${this.winWidth}, height: ${this.winHeight}`)
    })

    ipcRenderer.on(KEYS.CONTENT_SIZE_CHANGED, (event, size: number[]) => {
      this.winWidth = size[0]
      this.winHeight = size[1]
      MainLog.info(`original: ${this.winWidth}, height: ${this.winHeight}`)
    })

    ipcRenderer.on(KEYS.RESTART_RECOGNIZE, () => {
      CaptureManager.getInstance().restart()
    })
    // const win = remote.BrowserWindow.getFocusedWindow()
    // if (win) {
    //   // 获取窗口宽度比设置的大了1px
    //   // MainLog.info(`origin: width:${win.getSize()[0]}, height:${win.getSize()[1]}`)
    //   // MainLog.info(`content: width:${win.getContentSize()[0]}, height:${win.getContentSize()[1]}`)
    //   // MainLog.info(`bounds: width:${win.getBounds().width}, height:${win.getBounds().height}`)
    //   // MainLog.info(`ContentBounds: width:${win.getContentBounds().width}, height:${win.getContentBounds().height}`)
    // }
    CaptureManager.getInstance().start()
    this.inside = true
    setTimeout(() => {
      this.inside = false
      // ipcRenderer.send(IPC.LOCK_CONTENT)
    }, 2000)
    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mousedown', this.handleMouseDown, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
  }

  get boxStyle() {
    if (this.inside) {
      return {
        boxShadow: '0 0 5px white',
        border: 'black 1px solid'
      }
    } else {
      return {}
    }
  }

  capture() {
    // 截取屏幕
    ipcRenderer.send(KEYS.OPEN_CAPTURE_WINDOW)
  }

  selectWindow() {
    // 选择窗口
    ipcRenderer.send(KEYS.MAIN_PROXY, KEYS.CAPTURE_WINDOW)
  }

  minus() {
    if (this.textSize >= 16) {
      this.textSize -= 5
    }
  }

  plus() {
    if (this.textSize <= 36) {
      this.textSize += 5
    }
  }

  handleMouseDown(e: MouseEvent) {
    this.dragging = true
    this.wX = e.pageX
    this.wY = e.pageY
    this.screenX = e.screenX
    this.screenY = e.screenY
    // const win = remote.BrowserWindow.getFocusedWindow()
    // if (win) {
    //   this.winWidth = win.getSize()[0]
    //   this.winHeight = win.getSize()[1]
    //   MainLog.info(win.getSize())
    // }
  }

  handleMouseMove(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (this.dragging) {
      const xLoc = e.screenX - this.wX
      const yLoc = e.screenY - this.wY
      const win = remote.BrowserWindow.getFocusedWindow()
      if (win) {
        // win.setPosition(xLoc, yLoc)
        win.setBounds({
          x: xLoc,
          y: yLoc,
          width: this.winWidth,
          height: this.winHeight
        })
      }
    }
  }

  handleMouseUp(e: MouseEvent) {
    this.dragging = false
  }

  close() {
    CaptureManager.getInstance().stop()
    ipcRenderer.send(KEYS.CLOSE_CONTENT)
  }

  enter() {
    this.inside = true
    MainLog.info('enter')
  }

  leave() {
    this.inside = false
    MainLog.info('leave')
  }

  beforeDestroy () {
    CaptureManager.getInstance().stop()
    window.removeEventListener('mousedown', this.handleMouseDown, false)
    window.removeEventListener('mousemove', this.handleMouseMove, false)
    window.removeEventListener('mouseup', this.handleMouseUp, false)
    window.removeEventListener('mouseenter', this.enter, false)
    window.removeEventListener('mouseleave', this.leave, false)
  }
}
</script>

<style scoped lang="scss">

  * {
    box-sizing: border-box;
  }

  #root {
    width: 100%;
    height: 100%;
    padding: 6px;
    /*background-color: transparent;*/
  }

  #container {
    width: 100%;
    height: 100%;
    padding: 10px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  #action_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 20px;
  }

  #actions {
    li {
        display: inline-block;
        padding: 4px;
        margin-left: 10px;
        i {
          font-size: 16px;
          color: white;
          text-shadow: 0 0 2px black;
        }
        i:hover {
          color: #409EFF;
        }
    }

    .el-icon-close:hover {
      color: #F15140;
    }

    li:first-child {
      margin-left: 0;
    }
  }

  #content {
    width: 100%;
    flex: 1;
    padding: 8px;
    overflow-y: scroll;
    p {
      width: 100%;
      color: transparent;
      text-align: center;
      align-self: center;
      /*background-image: linear-gradient(to bottom, blue, red);*/
      /*-webkit-background-clip: text;*/
      color: #42b983;
      letter-spacing: 1px;
      text-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.5);
    }
    p::-webkit-scrollbar {
      display: none;
    }
  }
</style>
