<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import { IPC, Mutations } from './constant/Constants'
import CaptureManager from './ocr/CaptureManager'
import { HotKey, HotKeyConf } from '@/config/Conf'
import { IPayloadWrapper } from '@/store/PayloadWrapper'

@Component
export default class App extends Vue {
  created() {
    window.addEventListener('keyup', (event) => {
      if (event.code === 'F12') {
        ipcRenderer.send(IPC.OPEN_DEVTOOL)
      }
    })
    ipcRenderer.on(IPC.FINISH_RECOGNIZE, () => {
      CaptureManager.getInstance().stop()
    })
    ipcRenderer.on(IPC.HOTKEY_INVALID, (event, hotkey: HotKey) => {
      this.$store.commit(Mutations.MUTATION_CHANGE_HOTKEY, hotkey)
    })
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
    width: 100%;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
