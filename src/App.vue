<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import { IPC } from './constant/Constants'

@Component
export default class App extends Vue {
  created() {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'F12') {
        ipcRenderer.send(IPC.OPEN_DEVTOOL)
      }
    })
  }
}
</script>

<style lang="scss">
    #app {
        height: 100%;
        width: 100%;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>
