import RootStore from './RootStore'
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { Mutations, StoreKey, StoreDefault } from '../constant/Constants'
import conf, { HotKey, HotKeyConf } from '../config/Conf'
import { IPayloadWrapper } from '@/store/PayloadWrapper'

Vue.use(Vuex)

const rootStore: StoreOptions<RootStore> = {
  state: {
    // 快捷键
    hotkey: {
      captureScreen: conf.hotkey.get('captureScreen'),
      captureWindow: conf.hotkey.get('captureWindow'),
      startRecognize: conf.hotkey.get('startRecognize')
    },
    translate: {
      source: conf.translate.get('source'),
      target: conf.translate.get('target'),
      baiduOcrSecret: conf.translate.get('baiduOcrSecret'),
      baiduOcrApiKey: conf.translate.get('baiduOcrApiKey'),
      baiduTransAppId: conf.translate.get('baiduTransAppId'),
      baiduTransSecret: conf.translate.get('baiduTransSecret'),
      resultText: ''
    }
  },
  mutations: {
    [Mutations.MUTATION_RESULT_TEXT](state, payload: string) {
      state.translate.resultText = payload
    },
    [Mutations.MUTATION_SOURCE_LANG](state, payload: string) {
      state.translate.source = payload
      conf.translate.set('source', payload)
    },
    [Mutations.MUTATION_TARGET_LANG](state, payload: string) {
      state.translate.target = payload
      conf.translate.set('target', payload)
    },
    [Mutations.MUTATION_BAIDU_OCRAPIKEY](state, payload: string) {
      state.translate.baiduOcrApiKey = payload
      conf.translate.set('baiduOcrApiKey', payload)
    },
    [Mutations.MUTATION_BAIDU_OCRAPISECRET](state, payload: string) {
      state.translate.baiduOcrSecret = payload
      conf.translate.set('baiduOcrSecret', payload)
    },
    [Mutations.MUTATION_BAIDU_TRANSLATE_APPID](state, payload: string) {
      state.translate.baiduTransAppId = payload
      conf.translate.set('baiduTransAppId', payload)
    },
    [Mutations.MUTATION_BAIDU_TRANSLATE_SECRET](state, payload: string) {
      state.translate.baiduTransSecret = payload
      conf.translate.set('baiduTransSecret', payload)
    },
    [Mutations.MUTATION_CHANGE_HOTKEY](state, payload: HotKey) {
      state.hotkey[payload.key] = payload
      conf.hotkey.set(payload.key, payload)
    }
  },
  actions: {},
  modules: {}
}

export default new Vuex.Store(rootStore)
