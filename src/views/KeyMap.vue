<template>
  <el-main ref="container">
    <el-row v-for="item in Object.keys($store.state.hotkey)" :key="item.id" type="flex" align="middle">
      <el-col :span="6">
        <p>{{$store.state.hotkey[item].name + '：'}}</p>
      </el-col>
      <el-col :span="10">
          <el-button @click="changeHotKey($store.state.hotkey[item])">{{$store.state.hotkey[item].value}}</el-button>
        <el-tooltip effect="dark" content="快捷键冲突，请重新设置" placement="top">
          <i class="el-icon-warning invalid" v-if="!$store.state.hotkey.captureScreen.valid"/>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-dialog
        title="设置快捷键"
        :visible.sync="dialogVisible"
        width="40%">
      <div class="body">
        <p class="tips">直接在键盘输入新的快捷键</p>
        <div class="content">
          <span class="hotkey" v-if="newHotKey != null">{{newHotKey.value}}</span>
          <el-tooltip effect="dark" content="快捷键已被占用，请重新设置" placement="top">
            <i class="el-icon-warning invalid" v-if="!newHotKeyValid"/>
          </el-tooltip>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="updateHotkey">确 定</el-button>
      </span>
    </el-dialog>
<!--    <el-row type="flex" align="middle">-->
<!--      <el-col :span="8">-->
<!--        <p>捕获窗口:</p>-->
<!--      </el-col>-->
<!--      <el-col :span="8">-->
<!--        <p>{{$store.state.hotkey.captureWindow.value}}</p>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </el-main>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { HotKey } from '@/config/Conf'
import { ipcRenderer } from 'electron'
import { IPC, Mutations } from '@/constant/Constants'
import HotKeyUtil from '@/utils/HotKeyUtil'

@Component
export default class KeyMap extends Vue {
  dialogVisible = false
  newHotKey: HotKey | null = null
  newHotKeyValid = false

  mounted() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (this.dialogVisible) {
        if (this.newHotKey != null) {
          console.log(event)
          const key = HotKeyUtil.getKeys(event)
          if (key) {
            this.newHotKey.value = key
          }
          event.preventDefault()
          event.returnValue = false
        }
      }
    })
  }

  changeHotKey(hotKey: HotKey) {
    this.newHotKey = JSON.parse(JSON.stringify(hotKey))
    this.dialogVisible = true
  }

  async updateHotkey() {
    const hotKey: HotKey = await ipcRenderer.invoke(IPC.CHANGE_HOTKEY, this.newHotKey)
    if (hotKey.valid) {
      this.$store.commit(Mutations.MUTATION_CHANGE_HOTKEY, hotKey)
      this.dialogVisible = false
    } else {
      this.newHotKeyValid = false
      this.$message.error('快捷键已被占用，请重新设置')
    }
  }
}
</script>

<style scoped lang="scss">
  p {
    color: $primary-text;
  }
  .el-col {
    display: flex;
    flex-direction: row;
    align-items: center;
    .el-button {
      border: $divider solid 2px;
      padding: 8px 10px;
      text-align: center;
      flex: 1;
      cursor: pointer;
    }
  }
  .invalid {
    font-size: 20px;
    margin-left: 20px;
    color: red;
  }
  .el-row:not(:first-of-type) {
    margin-top: 20px;
  }

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tips {
    font-size: 14px;
    color: $secondary-text;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    overflow: hidden;

    .hotkey {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: normal;
      white-space: nowrap;
      text-align: center;
      font-size: 16px;
      max-width: 70%;
      color: $primary-text;
    }
  }
</style>
