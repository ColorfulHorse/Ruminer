<template>
    <el-container>
        <el-main>
            <el-button @click="selectArea">选择区域</el-button>
        </el-main>
    </el-container>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import { IPC } from '../constant/Constants'

@Component
export default class Main extends Vue {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectArea() {
    ipcRenderer.send(IPC.SELECT_AREA)
  }
}
</script>

<style scoped lang="scss">

</style>
