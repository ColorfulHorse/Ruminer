<template>
    <div id="overlay" ref="root">
        <canvas id="canvas" ref="canvas" @mousedown="startCapture" @mousemove="move" @mouseup="finishCapture"/>
        <ul id="actions" ref="actions" autofocus v-if="showAction" :style="{ left: actionLeft + 'px', top: actionTop + 'px' }">
          <li @click="cancel"><i class="el-icon-close" style="color: red;"/></li>
          <li @click="confirm"><i class="el-icon-check" style="color: limegreen;"/></li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import { Point, Rect } from '../graphics/Graphics'
import { MainLog } from '@/utils/MainLog'
import { KEYS } from '@/electron/event/IPC'

@Component({
  name: 'Overlay'
})
export default class Overlay extends Vue {
  capturing = false
  // 显示操作按钮
  showAction = false
  private rect: Rect = new Rect()
  private startPoint = new Point()
  private endPoint = new Point()

  canvas: HTMLCanvasElement | null = null

  actionLeft = 0

  actionTop = 0

  created() {
    window.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') {
        ipcRenderer.send(KEYS.CLOSE_OVERLAY)
      }
    })
  }

  mounted() {
    const root = this.$refs.root as HTMLDivElement
    const canvas = this.$refs.canvas as HTMLCanvasElement
    canvas.width = root.offsetWidth
    canvas.height = root.offsetHeight
    this.canvas = canvas
    this.draw()
  }

  draw(rect: Rect | null = null) {
    if (this.canvas != null) {
      const ctx = this.canvas.getContext('2d')
      if (ctx != null) {
        // 绘制遮罩
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        ctx.fillStyle = 'rgba(0,0,0,0.4)'
        ctx.fill()
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        if (rect != null) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0)'
          ctx.clearRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top)
        }
      }
    }
  }

  startCapture(event: MouseEvent) {
    this.capturing = true
    this.showAction = false
    this.startPoint.x = event.x
    this.startPoint.y = event.y
    this.endPoint.x = event.x
    this.endPoint.y = event.y
  }

  move(event: MouseEvent) {
    if (this.capturing) {
      this.endPoint.x = event.x
      this.endPoint.y = event.y
      this.rect.fromPoints(this.startPoint, this.endPoint)
      this.draw(this.rect)
    }
  }

  finishCapture(event: MouseEvent) {
    this.endPoint.x = event.x
    this.endPoint.y = event.y
    this.capturing = false
    this.showAction = true
    this.rect.fromPoints(this.startPoint, this.endPoint)
    this.draw(this.rect)
    const root = this.$refs.root as HTMLDivElement
    // 30 actions 高度， 70 actions 宽度
    const maxBottom = root.offsetHeight - 30
    const maxRight = root.offsetWidth - 70
    let left = this.rect.right
    if (this.rect.right > maxRight) {
      left = this.rect.right - 70
    }
    let top = this.rect.bottom
    if (this.rect.bottom > maxBottom) {
      top = this.rect.bottom - 30
    }
    this.actionTop = top
    this.actionLeft = left
  }

  cancel() {
    this.showAction = false
    this.clear()
    ipcRenderer.send(KEYS.CLOSE_OVERLAY)
  }

  confirm() {
    this.showAction = false
    MainLog.info(this.rect)
    this.$conf.temp.set('captureRect', this.rect)
    this.clear()
    // 打开显示翻译结果窗口
    ipcRenderer.send(KEYS.OPEN_CONTENT)
  }

  clear() {
    if (this.canvas != null) {
      const ctx = this.canvas.getContext('2d')
      if (ctx != null) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  #overlay {
    width: 100%;
    height: 100%;
    background-color: transparent;
    text-align: right;

    #actions {
      display: inline;
      position: absolute;
      padding: 0 5px;
      background-color: white;
      list-style: none;
      z-index: 999;
      li {
        display: inline-block;
        padding: 4px;
        i {
          font-size: 22px;
        }
      }
    }
  }

  #canvas {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
</style>
