<template>
  <el-main>
    <el-row type="flex">
      <el-col :span="24">
        <div class="sf-wrapper">
          <el-image class="sf-logo" fit="contain" lazy :src="require('../../public/logo.png')"/>
          <div class="sf-name">{{ $app.name }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="action-wrapper" @click="captureScreen">
          <p class="action">捕获屏幕</p>
          <p class="tips">{{ $store.state.hotkey.captureScreen.value }}</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="action-wrapper" @click="captureWindow">
          <p class="action">捕获窗口</p>
          <p class="tips">{{ $store.state.hotkey.captureWindow.value }}</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="action-wrapper" @click="startRecognize">
          <p class="action">开始翻译</p>
          <p class="tips">{{ $store.state.hotkey.startRecognize.value }}</p>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer, desktopCapturer, remote } from 'electron'
import { KEYS } from '@/electron/event/IPC'

@Component({
  name: 'Main'
})
export default class Main extends Vue {
  mounted() {
    ipcRenderer.on(KEYS.CAPTURE_WINDOW, () => {
      this.captureWindow()
    })

    ipcRenderer.on(KEYS.CAPTURE_SCREEN, () => {
      this.captureScreen()
    })
  }

  captureScreen() {
    this.capture('screen')
  }

  captureWindow() {
    this.capture('window')
  }

  startRecognize() {
    // ipcRenderer.send(IPC.OPEN_CONTENT)
  }

  async capture(mode: 'screen' | 'window') {
    if (mode === 'screen') {
      const screen = remote.screen
      const {width, height} = screen.getPrimaryDisplay().bounds
      const sources = await desktopCapturer.getSources({types: ['screen']})
      const source = sources[0]
      ipcRenderer.send(KEYS.OPEN_CAPTURE_WINDOW, source.id)
    } else {
      const sources = await desktopCapturer.getSources({types: ['window']})
      ipcRenderer.send(KEYS.OPEN_SELECT_WINDOW, JSON.stringify({
        data: sources
      }))
    }
  }
}
</script>

<style scoped lang="scss">
  .el-row {
    .sf-wrapper {
      width: 100%;
      padding: 24px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .sf-logo {
        width: 64px;
        height: 64px;
        margin-right: 20px;
      }

      .sf-name {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        color: $main-text;
        font-size: 32px;
        font-weight: 400;
      }
    }

    .el-col {
      .action-wrapper {
        background-color: #f1f1f1;
        border-radius: 0 10px 0 10px;
        padding: 20px 10px;
        text-align: center;
        vertical-align: middle;
      }
      .action-wrapper:hover {
        background-color: #dcdcdc;
      }

      .action {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 18px;
        font-weight: 600;
      }

      .tips {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 16px;
        font-weight: 100;
        color: $secondary-text;
        margin-top: 20px;
      }
    }
  }
</style>
