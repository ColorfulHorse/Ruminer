<template>
  <el-main>
    <el-form :model="formData" :rules="rules" ref="form" label-width="30%" label-position="left">
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
      <el-form-item label="百度 OcrApiKey" prop="ocrKey">
        <el-input v-model="formData.ocrKey" @input="ocrKey"/>
      </el-form-item>
      <el-form-item label="百度 OcrSecret" prop="ocrSecret">
        <el-input v-model="formData.ocrSecret" @input="ocrSecret"/>
      </el-form-item>
      <el-form-item label="百度翻译 AppId" prop="transAppId">
        <el-input v-model="formData.transAppId" @input="transAppId"/>
      </el-form-item>
      <el-form-item label="百度翻译 AppSecret" prop="transSecret">
        <el-input v-model="formData.transSecret" @input="transSecret"/>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import LangMapper from '@/utils/LangMapper'
import { Mutations } from '@/constant/Constants'
import { Form } from 'element-ui'

@Component({
  name: 'Config'
})
export default class Config extends Vue {
  formData = {
    ocrKey: this.$store.state.translate.baiduOcrApiKey,
    ocrSecret: this.$store.state.translate.baiduOcrSecret,
    transAppId: this.$store.state.translate.baiduTransAppId,
    transSecret: this.$store.state.translate.baiduTransSecret
  }

  rules = {
    ocrKey: [
      {required: true, message: '请输入百度ocr api key', trigger: 'blur'}
    ],
    ocrSecret: [
      {required: true, message: '请输入百度ocr api secret', trigger: 'blur'}
    ],
    transAppId: [
      {required: true, message: '请输入百度翻译 appId', trigger: 'blur'}
    ],
    transSecret: [
      {required: true, message: '请输入百度翻译 secret', trigger: 'blur'}
    ]
  }

  langs = [...LangMapper.map.values()]

  mounted() {
    (this.$refs.form as Form).validate()
      .then(valid => {})
      .catch(error => {
        console.log(error)
      })
  }

  get source() {
    return this.$store.state.translate.source
  }

  set source(value: string) {
    this.$store.commit(Mutations.MUTATION_SOURCE_LANG, value)
    console.log(this.$store.state)
  }

  get target() {
    return this.$store.state.translate.target
  }

  set target(value: string) {
    this.$store.commit(Mutations.MUTATION_TARGET_LANG, value)
  }

  ocrKey(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_OCRAPIKEY, value)
  }

  ocrSecret(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_OCRAPISECRET, value)
  }

  transAppId(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_TRANSLATE_APPID, value)
  }

  transSecret(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_TRANSLATE_SECRET, value)
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 30px;

    /deep/label {
      color: $main-text;
    }

    /deep/.el-input__inner {
      border-radius: 30px;
    }

    .el-input {
      /deep/.el-input__inner {
        line-height: 38px;
      }
    }
  }
</style>
