<template>
  <div id="root" ref="root">
    <div id="container" ref="container" @mouseenter="enter" @mouseleave="leave">
      <div id="inner" :style="boxStyle">
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
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { DesktopCapturerSource, ipcRenderer } from 'electron'
import CaptureManager from '../ocr/CaptureManager'
import { KEYS } from '@/electron/event/IPC'

@Component({
  name: 'Content'
})
export default class Content extends Vue {
  textSize = 24

  inside = false

  mounted() {
    CaptureManager.getInstance().start()
    this.inside = true
    setTimeout(() => {
      this.inside = false
      // ipcRenderer.send(IPC.LOCK_CONTENT)
    }, 2000)
    // const root = this.$refs.root as HTMLDivElement
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
    ipcRenderer.send(KEYS.OPEN_CAPTURE_WINDOW)
  }

  selectWindow() {
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

  enter() {
    this.inside = true
  }

  leave(event: MouseEvent) {
    const root = this.$refs.root as HTMLDivElement
    if (event.x < 20 || event.x > root.offsetWidth - 20 || event.y < 20 || event.y > root.offsetHeight - 20) {
      this.inside = false
    }
  }

  close() {
    CaptureManager.getInstance().stop()
    ipcRenderer.send(KEYS.CLOSE_CONTENT)
  }
}
</script>

<style scoped lang="scss">

  * {
    box-sizing: border-box;
  }

  #root {
    width: 800px;
    height: auto;
    min-height: 200px;
    padding: 10px;
    background-color: transparent;
  }

  #container {
    width: 100%;
    height: 100%;
    padding: 10px;
  }

  #inner {
    -webkit-app-region: drag;
    -webkit-user-select: none;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /*box-shadow: 0 0 5px white;*/
    /*border: black 1px solid;*/
    background-color: transparent;
  }

  #action_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 20px;
    margin-top: 8px;
  }

  #actions {
    li {
        -webkit-app-region: no-drag;
        display: inline-block;
        padding: 4px;
        margin-left: 10px;
        i {
          -webkit-app-region: no-drag;
          font-size: 16px;
          color: white;
          text-shadow: 0 0 2px black;
        }
        i:hover {
          text-shadow: 0 0 5px black;
        }
    }

    li:first-child {
      margin-left: 0;
    }
  }

  #content {
    width: 100%;
    flex: 1;
    padding: 8px;
    display: flex;
    p {
      width: 100%;
      color: transparent;
      text-align: center;
      align-self: center;
      overflow: hidden;
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
