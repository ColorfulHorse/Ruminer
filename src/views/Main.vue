<template>
    <el-main>
        <el-row :gutter="10">
          <el-col :span="10">
            <div class="action-wrapper">
              <p class="action">捕获屏幕</p>
              <p class="tips">快捷键:XXX</p>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="action-wrapper">
              <p class="action">捕获窗口</p>
              <p class="tips">快捷键:XXX</p>
            </div>
          </el-col>
        </el-row>
    </el-main>
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
  .el-row {
    .el-col {
      .action-wrapper{
        background-color: beige;
        border-radius: 0 5px 0 5px;
        padding: 10px;
        text-align: center;
        vertical-align: middle;
      }
        .action {
          font-size: 18px;
          color: black;
        }
        .tips {
          font-size: 16px;
          color: gray;
          margin-top: 10px;
        }
    }
  }
</style>
