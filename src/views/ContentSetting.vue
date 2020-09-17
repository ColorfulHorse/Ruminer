<template>
  <el-main>
    <el-form label-width="25%" label-position="left">
      <el-form-item label="文字窗口背景色">
        <el-color-picker
            v-model="contentStyle.bgColor"
            show-alpha
            size="small"
            @change="change">
        </el-color-picker>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker
            v-model="contentStyle.fontColor"
            show-alpha
            size="small"
            :predefine="predefineColors"
            @change="change">
        </el-color-picker>
      </el-form-item>
      <el-form-item label="字体大小" class="slider-item">
        <div class="slider-wrapper">
          <el-slider v-model="contentStyle.fontSize" :min="min" :max="max" :marks="marks" @change="change"/>
        </div>
      </el-form-item>
      <el-form-item label="字体样式">
        <el-select
            class="font-select"
            v-model="contentStyle.fontFamily" @change="change"
            :style="{ fontFamily: contentStyle.fontFamily}">
          <el-option
              v-for="item in fonts"
              :key="item.id"
              :label="item"
              :value="item"
              :style="{ fontFamily: item }">
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
      <el-image :src="require('../../public/test.jpg')" fit="cover"/>
      <div class="text" :style="previewStyle">这里是预览字体</div>
    </div>
  </el-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultContentStyle } from '@/config/Conf'
import { KEYS } from '@/electron/event/IPC'
import { ipcRenderer } from 'electron'
import { getFonts } from 'font-list'

@Component({
  name: 'content-style'
})
export default class ContentSetting extends Vue {
  min = 16
  max = 36
  test = 'rgba(0, 0, 0, 0)'
  contentStyle = defaultContentStyle()
  fonts: Array<string> = []
  weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
  predefineColors = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#42b983',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(0, 0, 0, 0)'
  ]

  marks = {
    16: '16px',
    36: '36px'
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
      color: this.contentStyle.fontColor,
      fontWeight: this.contentStyle.fontWeight,
      fontSize: this.contentStyle.fontSize + 'px',
      fontFamily: this.contentStyle.fontFamily,
      textAlign: this.contentStyle.fontAlign
    }
  }

  beforeCreate() {
    console.log(Date.now())
    ipcRenderer.invoke(KEYS.GET_SYSTEM_FONTS).then((fonts: Array<string>) => {
      this.fonts = fonts
      console.log(Date.now())
    })
    // ipcRenderer.send(KEYS.GET_SYSTEM_FONTS)
    // getFonts()
    //   .then(fonts => {
    //     this.fonts = fonts.map(value => value.replace(/"/g, ''))
    //     console.log(Date.now())
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  created() {
    this.contentStyle = this.$conf.common.get('contentStyle')
  }

  change() {
    this.$conf.common.set('contentStyle', this.contentStyle)
    ipcRenderer.send(KEYS.CONTENT_STYLE_CHANGED)
  }
}
</script>

<style scoped lang="scss">

  /deep/label {
    color: $main-text;
  }

  /deep/.font-select {
    .el-input__inner {
      font-family: inherit;
    }
  }

  .slider-item {
    margin-bottom: 40px;
    .slider-wrapper {
      width: 80%;
    }
  }

  .preview {
    width: 100%;
    height: 100px;
    position: relative;
    .el-image {
      width: 100%;
      height: 100%;
    }
    .text {
      width: 100%;
      height: 100%;
      line-height: 100px;
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      vertical-align: middle;
      border: white 1px solid;
      letter-spacing: 1px;
      text-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.5);
    }
  }
</style>
