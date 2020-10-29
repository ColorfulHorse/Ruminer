<template>
  <el-main ref="container">
    <el-table
        :data="hotKeys"
        size="medium"
        row-class-name="tb-row"
        al
    >
      <el-table-column
          label="快捷键名称"
          align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
          label="快捷键绑定"
          prop="value"
          align="center"
      >
      </el-table-column>
      <el-table-column
          label="状态"
          align="center"
      >
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="快捷键冲突，请重新设置" placement="top" :disabled="scope.row.valid">
            <el-tag
                size="mini"
                :type="scope.row.enable ? (scope.row.valid ? 'success' : 'danger') : 'danger'"
            >
              {{ scope.row.enable ? (scope.row.valid ? '已启用' : '冲突') : '已禁用' }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          align="center">
        <template slot-scope="scope">
          <el-button
              @click="toggleEnable(scope.$index, scope.row)"
              size="mini"
              :class="{
                  disabled: scope.row.enable
                }"
              type="text">
            {{ scope.row.enable ? '禁用' : '启用' }}
          </el-button>
          <el-button
              class="edit"
              size="mini"
              @click="changeHotKey(scope.row)"
              type="text">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
import { HotKey, HotKeyConf } from '@/config/Conf'
import { ipcRenderer } from 'electron'
import { Mutations } from '@/constant/Constants'
import HotKeyUtil from '@/utils/HotKeyUtil'
import { ElInput } from 'element-ui/types/input'
import { KEYS } from '@/electron/event/IPC'
import { State } from 'vuex-class'
import RootStore from '@/store/RootStore'

@Component({
  name: 'KeyMap'
})
export default class KeyMap extends Vue {
  dialogVisible = false
  newHotKey: HotKey | null = null

  @State((state: RootStore) => {
    const keys = Object.keys(state.hotkey) as Array<keyof HotKeyConf>
    return keys.map(value => {
      return state.hotkey[value]
    })
  })
  hotKeys?: HotKey[]

  created() {
    const keys = Object.keys(this.$store.state.hotkey) as Array<keyof HotKeyConf>
    this.hotKeys = keys.map(value => {
      return this.$store.state.hotkey[value]
    })
  }

  keyDetect(event: KeyboardEvent) {
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

  async toggleEnable(index: number, hotKey: HotKey) {
    const key: HotKey = await ipcRenderer.invoke(KEYS.TOGGLE_HOTKEY, hotKey)
    this.$store.commit(Mutations.MUTATION_CHANGE_HOTKEY, key)
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
$table-text: $main-text;

/deep/ .el-table {
  background-color: transparent;
  color: $table-text;

  thead {
    color: $table-text;
  }

  th, tr {
    background-color: transparent;
  }

  &::before {
    display: none;
  }

  th {
    border: none;
  }

  td {
    border: none;
  }

  &__body {
    tr.el-table__row--striped {
      td {
        background: transparent;
      }
    }
  }

  &--enable-row-hover {
    .el-table__body {
      tr:hover > td {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }

  .el-button {
    &.disabled {
      color: #F56C6C;

      &:hover {
        color: #f78989;
      }
    }
  }
}

/deep/ .el-dialog {
  .el-form-item {
    margin-bottom: 0;
  }
}

.el-alert {
  margin-top: 10px;
}
</style>
