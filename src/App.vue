<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import { Mutations } from './constant/Constants'
import { HotKey } from '@/config/Conf'
import { KEYS } from '@/electron/event/IPC'

@Component({
  name: 'App'
})
export default class App extends Vue {
  created() {
    const isDev = process.env.NODE_ENV !== 'production'
    if (isDev) {
      window.addEventListener('keyup', (event) => {
        if (event.code === 'F12') {
          ipcRenderer.send(KEYS.OPEN_DEVTOOL)
        }
      })
    }
    ipcRenderer.on(KEYS.HOTKEY_INVALID, (event, hotkey: HotKey) => {
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
    color: #212121;
  }
</style>
