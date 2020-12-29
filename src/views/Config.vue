<template>
  <el-main>
    <el-form ref="form" :model="formData" :rules="rules" label-width="30%" label-position="left">
      <el-row>
        <el-col :span="11">
          <el-form-item label="源语言" label-width="80px">
            <el-select v-model="source">
              <el-option
                  v-for="item in langs"
                  :key="item.alias"
                  :label="item.name"
                  :value="item.alias">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="目标语言" label-width="80px">
            <el-select v-model="target">
              <el-option
                  v-for="item in langs"
                  :key="item.alias"
                  :label="item.name"
                  :value="item.alias">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="ocr-container">
        <el-checkbox size="medium" v-model="localOCR" @change="changeLocalOcr">是否启用本地文字识别</el-checkbox>
        <el-tooltip>
          <i class="el-icon-question"></i>
          <p slot="content">
            本地文字识别完全免费，但是只有在背景和文字颜色对比较明显的时候效果较好，请看情况开启
          </p>
        </el-tooltip>
      </el-row>
      <el-form-item v-if="!localOCR" label="百度文字识别 ApiKey" prop="baiduOcrApiKey">
        <el-input v-model="formData.baiduOcrApiKey" @input="baiduOcrApiKey"/>
      </el-form-item>
      <el-form-item v-if="!localOCR" label="百度文字识别 Secret" prop="baiduOcrSecret">
        <el-input v-model="formData.baiduOcrSecret" @input="baiduOcrSecret"/>
      </el-form-item>
      <el-form-item label="翻译平台" style="margin-bottom: 15px">
      </el-form-item>
      <el-radio-group v-model="platform" @change="changePlatform">
        <el-radio-button v-for="item in platforms" :key="item.id" :label="item"></el-radio-button>
      </el-radio-group>
    </el-form>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </el-main>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import LangMapper from '@/utils/LangMapper'
import { Mutations, Platform, Platforms } from '@/constant/Constants'
import conf from '@/config/Conf'
import { ipcRenderer } from 'electron'
import { KEYS } from '@/electron/event/IPC'
import { Form } from 'element-ui'

@Component({
  name: 'Config'
})
export default class Config extends Vue {
  // 翻译平台
  platforms = Platforms
  platform = Platforms[conf.translate.get('platform')]

  langs = [...LangMapper.map.values()]

  // 本地ocr
  localOCR = false

  formData = {
    baiduOcrApiKey: conf.translate.get('baiduOcrApiKey'),
    baiduOcrSecret: conf.translate.get('baiduOcrSecret')
  }

  rules = {
    baiduOcrApiKey: [
      {required: !this.localOCR, message: '请输入百度文字识别 ApiKey', trigger: 'blur'}
    ],
    baiduOcrSecret: [
      {required: !this.localOCR, message: '请输入百度文字识别 Secret', trigger: 'blur'}
    ]
  }

  created() {
    this.localOCR = this.$conf.translate.get('localOCR')
  }

  mounted() {
    (this.$refs.form as Form).validate()
      .then(valid => {
      })
      .catch(error => {
        console.log(error)
      })
  }

  get source() {
    return this.$store.state.translate.source
  }

  set source(value: string) {
    this.$store.commit(Mutations.MUTATION_SOURCE_LANG, value)
    // 如果启用了本地ocr，变更源语言以后需要重启检测api
    ipcRenderer.send(KEYS.RESTART_RECOGNIZE)
  }

  get target() {
    return this.$store.state.translate.target
  }

  set target(value: string) {
    this.$store.commit(Mutations.MUTATION_TARGET_LANG, value)
  }

  changeLocalOcr(value: boolean) {
    if (!value) {
      (this.$refs.form as Form).validate()
        .then(valid => {
        })
        .catch(error => {
          console.log(error)
        })
    }
    this.$conf.translate.set('localOCR', value)
    // 开启/关闭本地ocr
    ipcRenderer.send(KEYS.RESTART_RECOGNIZE)
  }

  baiduOcrApiKey(value: string) {
    conf.translate.set('baiduOcrApiKey', value)
  }

  baiduOcrSecret(value: string) {
    conf.translate.set('baiduOcrSecret', value)
  }

  changePlatform() {
    const index = this.platforms.indexOf(this.platform)
    let route = 'BaiduConfig'
    switch (index) {
      case Platform.tencent:
        route = 'TxConfig'
        break
    }
    this.$router.push({name: route})
    this.$conf.translate.set('platform', this.platforms.indexOf(this.platform))
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  overflow-y: scroll;
}

.el-form {
  margin-bottom: 30px;
}

.el-form-item {
  margin-bottom: 30px;

  /deep/ label {
    color: $main-text;
  }

  /deep/ .el-input__inner {
    border-radius: 30px;
  }

  .el-input {
    /deep/ .el-input__inner {
      line-height: 38px;
    }
  }
}

.ocr-container {
  margin-bottom: 30px;
  /deep/ .el-checkbox {
    color: $main-text;
  }

  p {
    max-width: 50px;
    width: 50px;
  }

  .el-icon-question {
    margin-left: 10px;
    font-size: 18px;
    color: #BDBDBD;
  }
}
</style>
