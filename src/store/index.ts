import RootStore from './RootStore'
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { Mutations, StoreKey, StoreDefault } from '../constant/Constants'
import conf from '../config/Conf'

Vue.use(Vuex)

const rootStore: StoreOptions<RootStore> = {
  state: {
    // 快捷键
    hotkey: {
      captureScreen: conf.hotkey.get('captureScreen'),
      captureWindow: conf.hotkey.get('captureWindow')
    },
    translate: {
      source: conf.translate.get('source'),
      target: conf.translate.get('target'),
      resultText: ''
    }
  },
  mutations: {
    [Mutations.MUTATION_RESULT_TEXT](state, payload: string) {
      state.translate.resultText = payload
    },
    [Mutations.MUTATION_KEY_CAPTURE_SCREEN](state, payload: string) {
      state.hotkey.captureScreen = payload
    },
    [Mutations.MUTATION_KEY_CAPTURE_WINDOW](state, payload: string) {
      state.hotkey.captureWindow = payload
    }
  },
  actions: {},
  modules: {}
}

export default new Vuex.Store(rootStore)
