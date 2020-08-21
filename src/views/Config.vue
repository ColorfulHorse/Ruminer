<template>
  <el-main>
    <el-row type="flex" align="middle">
      <el-col :span="8">
        <p>源语言</p>
      </el-col>
      <el-col :span="16">
        <el-select v-model="source">
          <el-option
              v-for="item in langs"
              :key="item.alias"
              :label="item.name"
              :value="item.alias">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle">
      <el-col :span="8">
        <p>目标语言</p>
      </el-col>
      <el-col :span="16">
        <el-select v-model="target">
          <el-option
              v-for="item in langs"
              :key="item.alias"
              :label="item.name"
              :value="item.alias">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle">
      <el-col :span="8">
        <p>百度 OcrApiKey:</p>
      </el-col>
      <el-col :span="16">
        <el-input clearable v-model="ocrKey"/>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle">
      <el-col :span="8">
        <p>百度 OcrSecret:</p>
      </el-col>
      <el-col :span="16">
        <el-input clearable v-model="ocrSecret"/>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle">
      <el-col :span="8">
        <p>百度翻译 AppId:</p>
      </el-col>
      <el-col :span="16">
        <el-input clearable v-model="transAppId"/>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle">
      <el-col :span="8">
        <p>百度翻译 AppSecret:</p>
      </el-col>
      <el-col :span="16">
        <el-input clearable v-model="transSecret"/>
      </el-col>
    </el-row>
  </el-main>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import LangMapper from '@/utils/LangMapper'
import { Mutations } from '@/constant/Constants'
import { PayloadWrapper } from '@/store/PayloadWrapper'
import { HotKeyConf } from '@/config/Conf'

@Component
export default class Config extends Vue {
  langs = [...LangMapper.map.values()]

  get source() {
    return this.$store.state.translate.source
  }

  set source(value: string) {
    this.$store.commit(Mutations.MUTATION_SOURCE_LANG, value)
  }

  get target() {
    return this.$store.state.translate.target
  }

  set target(value: string) {
    this.$store.commit(Mutations.MUTATION_TARGET_LANG, value)
  }

  get ocrKey() {
    return this.$store.state.translate.baiduOcrApiKey
  }

  set ocrKey(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_OCRAPIKEY, value)
  }

  get ocrSecret() {
    return this.$store.state.translate.baiduOcrSecret
  }

  set ocrSecret(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_OCRAPISECRET, value)
  }

  get transAppId() {
    return this.$store.state.translate.baiduTransAppId
  }

  set transAppId(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_TRANSLATE_APPID, value)
  }

  get transSecret() {
    return this.$store.state.translate.baiduTransSecret
  }

  set transSecret(value: string) {
    this.$store.commit(Mutations.MUTATION_BAIDU_TRANSLATE_SECRET, value)
  }
}
</script>

<style lang="scss" scoped>
  .el-row:not(:first-of-type) {
    margin-top: 15px;
  }

  p {
    color: $primary-text;
  }
</style>
