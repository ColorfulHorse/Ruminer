<template>
  <el-main id="root">
    <ul v-for="item in sources" :key="item.id">
      <li @click="close(item.id)"><span>{{item.name}}</span></li>
    </ul>
  </el-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DesktopCapturerSource, ipcRenderer } from 'electron'
import { IPC } from '@/constant/Constants'

@Component
export default class Select extends Vue {
  sources = JSON.parse(process.argv[process.argv.length - 1]).data as Array<DesktopCapturerSource>

  close(sourceId: string) {
    ipcRenderer.send(IPC.SELECT_WINDOW_FINISH, sourceId)
  }
}
</script>

<style lang="scss" scoped>
  #root {
    width: 100%;
    height: 100%;
    ul {
      list-style: none;
      padding: 6px 0;
      margin: 0;
      box-sizing: border-box;
      li {
        font-size: 14px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
      }
      li:hover {
        background-color: #f5f7fa;
      }
    }
  }
</style>
