<template>
  <div id="root">
    <el-button @click="start">start</el-button>
    <p id="content">测试文本。。。。。。</p>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { CaptureManager } from '../ocr/CaptureManager'

@Component
export default class Content extends Vue {
  mounted() {
    // CaptureManager.getInstance().start()
  }

  start() {
    CaptureManager.getInstance().start()
  }

  destroyed() {
    CaptureManager.getInstance().stop()
  }
}
</script>

<style scoped lang="scss">
#root {
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.4);

  #content {
    padding: 16px;
    color: white;
    size: 18px;
  }
}
</style>
