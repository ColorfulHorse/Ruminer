<template>
  <el-main>
    <el-form label-width="100px">
      <el-form-item label="文字窗口背景颜色">
        <el-color-picker
            v-model="contentStyle.bgColor"
            show-alpha
            @change="change">
        </el-color-picker>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker
            v-model="contentStyle.fontColor"
            show-alpha
            :predefine="predefineColors"
            @change="change">
        </el-color-picker>
      </el-form-item>
      <el-form-item label="字体大小">
        <el-slider v-model="contentStyle.fontSize" :min="min" :max="max" range :marks="marks" @change="change"/>
      </el-form-item>
      <el-form-item label="字体样式">
        <el-select v-model="contentStyle.fontFamily" @change="change">
          <el-option
              v-for="item in fonts"
              :key="item.id"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字体粗细">
        <el-select v-model="contentStyle.fontWeight" @change="change">
          <el-option
              v-for="item in weights"
              :key="item.id"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对齐方式">
        <el-select v-model="contentStyle.fontAlign" @change="change">
          <el-option
              v-for="item in aligns"
              :key="item.id"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="preview">
      <el-image/>
      <div class="text" :style="previewStyle">这里是预览字体</div>
    </div>
  </el-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultContentStyle } from '@/config/Conf'
import { KEYS } from '@/electron/event/IPC'
import { ipcRenderer } from 'electron'

@Component({
  name: 'content-setting'
})
export default class ContentSetting extends Vue {
  min = 16
  max = 36
  contentStyle = defaultContentStyle()
  fonts: Array<string> = []
  weights = Array(9).map((value, index) => (index + 1) * 100)
  predefineColors = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#42b983',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    '#c7158577'
  ]

  marks = {
    16: '16px',
    36: '36px'
  }

  bgMarks = {
    0: '16px',
    1: '36px'
  }

  aligns = [
    {
      name: '居中',
      value: 'center'
    },
    {
      name: '左对齐',
      value: 'left'
    },
    {
      name: '右对齐',
      value: 'right'
    }
  ]

  get previewStyle() {
    return {
      background: this.contentStyle.bgColor,
      fontColor: this.contentStyle.fontColor,
      fontWeight: this.contentStyle.fontWeight,
      fontSize: this.contentStyle.fontSize,
      fontFamily: this.contentStyle.fontFamily,
      textAlign: this.contentStyle.fontAlign
    }
  }

  created() {
    // getAvailableFonts(fonts => {
    //   this.fonts = fonts.map(value => value.family)
    // })
    ipcRenderer.invoke(KEYS.GET_SYSTEM_FONTS).then((fonts: string[]) => {
      this.fonts = fonts
    })
    this.contentStyle = this.$conf.common.get('contentStyle')
  }

  change() {
    ipcRenderer.send(KEYS.CONTENT_STYLE_CHANGED)
  }
}
</script>

<style scoped lang="scss">
  .preview {
    width: 100%;
    height: 100px;
    .el-image {
      width: 100%;
      height: 100%;
    }
    .text {
      width: 100%;
      height: 100%;
      text-align: center;
      vertical-align: middle;
      border: white 1px solid;
    }
  }
</style>
