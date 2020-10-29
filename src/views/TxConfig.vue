<template>
  <el-form :model="formData" :rules="rules" ref="form" label-width="30%" label-position="left">
    <!--    <el-form-item label="百度 OcrApiKey" prop="ocrKey">-->
    <!--      <el-input v-model="formData.ocrKey" @input="ocrKey"/>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="百度 OcrSecret" prop="ocrSecret">-->
    <!--      <el-input v-model="formData.ocrSecret" @input="ocrSecret"/>-->
    <!--    </el-form-item>-->
    <el-form-item label="腾讯翻译 SecretId" prop="transAppId">
      <el-input v-model="formData.transAppId" @input="transAppId"/>
    </el-form-item>
    <el-form-item label="腾讯翻译 SecretKey" prop="transSecret">
      <el-input v-model="formData.transSecret" @input="transSecret"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import conf from '@/config/Conf'

@Component({
  name: 'TxConfig'
})
export default class TxConfig extends Vue {
  formData = {
    // ocrKey: this.$store.state.translate.baiduOcrApiKey,
    // ocrSecret: this.$store.state.translate.baiduOcrSecret,
    transAppId: conf.translate.get('tencentSecretId'),
    transSecret: conf.translate.get('tencentSecretKey')
  }

  rules = {
    // ocrKey: [
    //   {required: true, message: '请输入百度ocr api key', trigger: 'blur'}
    // ],
    // ocrSecret: [
    //   {required: true, message: '请输入百度ocr api secret', trigger: 'blur'}
    // ],
    transAppId: [
      {required: true, message: '请输入腾讯翻译 SecretId', trigger: 'blur'}
    ],
    transSecret: [
      {required: true, message: '请输入腾讯翻译 SecretKey', trigger: 'blur'}
    ]
  }

  // ocrKey(value: string) {
  //   this.$store.commit(Mutations.MUTATION_BAIDU_OCRAPIKEY, value)
  // }
  //
  // ocrSecret(value: string) {
  //   this.$store.commit(Mutations.MUTATION_BAIDU_OCRAPISECRET, value)
  // }

  created() {
    console.log('tx created')
  }

  mounted() {
    (this.$refs.form as Form).validate()
      .then(valid => {
      })
      .catch(error => {
        console.log(error)
      })
    console.log('tx mounted')
  }

  transAppId(value: string) {
    conf.translate.set('tencentSecretId', value)
  }

  transSecret(value: string) {
    conf.translate.set('tencentSecretKey', value)
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px;

  /deep/ label {
    color: $main-text;
  }

  /deep/ .el-input__inner {
    border-radius: 30px;
  }

  .el-input {
    /deep/ .el-input__inner {
      line-height: 35px;
    }
  }
}
</style>
