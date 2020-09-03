<template>
  <el-main ref="container">
    <el-row v-for="item in Object.keys($store.state.hotkey)" :key="item.id" type="flex" align="middle">
      <el-col :span="6">
        <p class="label">{{$store.state.hotkey[item].name + '：'}}</p>
      </el-col>
      <el-col :span="10">
          <el-button @click="changeHotKey($store.state.hotkey[item])">{{$store.state.hotkey[item].value}}</el-button>
      </el-col>
      <el-col :span="4">
        <el-tooltip effect="dark" content="快捷键冲突，请重新设置" placement="top">
          <i class="el-icon-warning invalid" v-if="!$store.state.hotkey[item].valid"/>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-dialog
        title="设置快捷键"
        :visible.sync="dialogVisible"
        @opened="dialogOpen"
        :modal-append-to-body="false">
      <el-form
          label-position="top"
          label-width="80px">
        <el-form-item :label="newHotKey == null ? '' : newHotKey.name">
          <el-input
              ref="input"
              class="align-center"
              @keydown.native.prevent="keyDetect"
              :value="newHotKey == null ? '' : newHotKey.value"
              autofocus="true">
          </el-input>
        </el-form-item>
      </el-form>
      <el-alert
          title="快捷键冲突，请重新设置"
          type="error"
          :closable="false"
          show-icon
          v-if="newHotKey == null ? false : !newHotKey.valid">
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="updateHotkey">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { HotKey } from '@/config/Conf'
import { ipcRenderer } from 'electron'
import { Mutations } from '@/constant/Constants'
import HotKeyUtil from '@/utils/HotKeyUtil'
import { ElInput } from 'element-ui/types/input'
import { KEYS } from '@/electron/event/IPC'

@Component({
  name: 'KeyMap'
})
export default class KeyMap extends Vue {
  dialogVisible = false
  newHotKey: HotKey | null = null

  keyDetect(event: KeyboardEvent) {
    console.log(event.key)
    if (this.newHotKey != null) {
      const key = HotKeyUtil.getKeys(event)
      if (key) {
        this.newHotKey.value = key
      }
    }
  }

  dialogOpen() {
    const input = this.$refs.input as ElInput
    input.focus()
  }

  changeHotKey(hotKey: HotKey) {
    this.newHotKey = JSON.parse(JSON.stringify(hotKey))
    this.dialogVisible = true
  }

  async updateHotkey() {
    const hotKey: HotKey = await ipcRenderer.invoke(KEYS.CHANGE_HOTKEY, this.newHotKey)
    if (this.newHotKey) {
      this.newHotKey.valid = hotKey.valid
    }
    if (hotKey.valid) {
      this.$store.commit(Mutations.MUTATION_CHANGE_HOTKEY, hotKey)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  .el-col {
    display: flex;
    flex-direction: row;
    align-items: center;
    .label {
      color: $main-text;
    }
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

  /deep/.el-dialog {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .el-alert {
    margin-top: 10px;
  }
</style>
