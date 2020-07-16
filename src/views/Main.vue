<template>
  <el-main>
    <el-row>
      <el-col :span="24">
        <div class="sf-wrapper">
          <el-image class="sf-logo" fit="contain" lazy :src="require('../../public/tray/logo.png')"/>
          <div class="sf-name">Auto-Translator</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="action-wrapper">
          <p class="action">捕获屏幕</p>
          <p class="tips">XXX</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="action-wrapper">
          <p class="action">捕获窗口</p>
          <p class="tips">XXX</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="action-wrapper">
          <p class="action">试试按键</p>
          <p class="tips">XXX</p>
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
    .sf-wrapper {
      width: 100%;
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .sf-logo {
        width: 60px;
        height: 60px;
        margin-right: 20px;
      }

      .sf-name {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        color: #2C3E50;
        font-size: 32px;
        font-weight: 400;
      }
    }

    .el-col {
      .action-wrapper {
        background-color: #F1F1F1;
        border-radius: 0 5px 0 5px;
        padding: 10px;
        text-align: center;
        vertical-align: middle;
      }

      .action {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 17px;
        font-weight: 700;
        color: black;
      }

      .tips {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 13px;
        font-weight: 100;
        color: gray;
        margin-top: 10px;
      }
    }
  }
</style>
