<template>
  <el-main id="root">
    <div id="header"><span id="title">选择目标窗口</span> <i class="el-icon-close" @click="close"></i></div>
    <ul>
      <li v-for="item in sources" :key="item.id" @click="confirm(item.id)">
        <el-tooltip effect="dark" :content="item.name" placement="top">
          <span>{{item.name}}</span>
        </el-tooltip>
      </li>
    </ul>
  </el-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DesktopCapturerSource, ipcRenderer } from 'electron'
import { KEYS } from '@/electron/event/IPC'

@Component({
  name: 'Select'
})
export default class Select extends Vue {
  sources = JSON.parse(process.argv[process.argv.length - 1]).data as Array<DesktopCapturerSource>

  confirm(sourceId: string) {
    ipcRenderer.send(KEYS.SELECT_WINDOW_FINISH, sourceId)
  }

  close() {
    ipcRenderer.send(KEYS.CLOSE_SELECT_WINDOW)
  }
}
</script>

<style lang="scss" scoped>
  #root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow-y: hidden;
    flex-direction: column;
    -webkit-app-region: drag;

    #header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      #title {
        flex: 1;
        color: $primary-text;
        font-size: 18px;
        font-weight: 500;
      }
      i {
        color: red;
        font-size: 24px;
        -webkit-app-region: no-drag;
      }
      i:hover {
        color: rgba($color: red, $alpha: 0.6);
      }
    }

    ul {
      list-style: none;
      flex: 1;
      box-sizing: border-box;
      overflow-y: scroll;
      -webkit-app-region: no-drag;
      li {
        font-size: 16px;
        padding: 10px 20px;
        color: $primary-text;
        box-sizing: border-box;
        cursor: pointer;
      }
      li:hover {
        background-color: #f5f7fa;
      }

      span {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

</style>
