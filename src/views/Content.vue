<template>
  <div id="root" ref="root" @mouseenter="showAction = true" @mouseleave="showAction = false">
    <div id="actions" v-if="showAction">
      <ul id="left">
        <li @click="minus"><i class="el-icon-minus"/></li>
        <li id="plus" @click="plus"><i class="el-icon-plus"/></li>
      </ul>
      <ul id="right">
        <li @click="close"><i class="el-icon-close"/></li>
      </ul>
    </div>

    <div id="main">
      <p id="content" :style="{ font_size : textSize + 'px' }">{{ recognizeText }}</p>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { ipcRenderer } from 'electron'
import CaptureManager from '../ocr/CaptureManager'
import { IPC } from '../constant/Constants'

@Component
export default class Content extends Vue {
  @State('recognizeText')
  recognizeText: any

  showAction = false

  textSize = 18

  created() {
  }

  mounted() {
    CaptureManager.getInstance().start()
    const root = this.$refs.root as HTMLDivElement
    ipcRenderer.send(IPC.LOCK_CONTENT, { width: root.offsetWidth, height: root.offsetHeight })
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

  close() {
    CaptureManager.getInstance().stop()
    ipcRenderer.send(IPC.CLOSE_CONTENT)
  }

  lockWindow() {
    ipcRenderer.send(IPC.LOCK_CONTENT)
  }
}
</script>

<style scoped lang="scss">
  body {
    height: auto;
    width: 800px;
  }

  /** {*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*}*/

  // * {
  //   -webkit-app-region: no-drag;
  // }

  #root {
    width: 100%;
  }

  #actions {
    -webkit-app-region: drag;
    width: 100%;
    padding: 0px 5px;
    margin-bottom: 10px;
    box-sizing: border-box;
    background-color: rgba($color: #000000, $alpha: 0.4);

    ul {
      display: inline-block;
      width: 50%;
    }
    ul:last-child {
      text-align: end;
    }
    li {
        -webkit-app-region: no-drag;
        display: inline-block;
        padding: 4px;
        i {
          font-size: 16px;
          color: white;
      }
    }

    #plus {
      margin-left: 15%;
    }
  }

  #main {
    width: 100%;
    min-height: 100px;
    background-color: rgba($color: #000000, $alpha: 0.4);

    #content {
      padding: 16px;
      color: white;

      p {
        vertical-align: center;
        text-align: center;
      }
    }
  }
</style>
