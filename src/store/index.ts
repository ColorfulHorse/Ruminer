import { RootStore } from './RootStore'
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { Mutations, StoreKey, StoreDefault } from '../constant/Constants'
import ElectronStore from 'electron-store'

Vue.use(Vuex)

const store = new ElectronStore()

const rootStore: StoreOptions<RootStore> = {
  state: {
    // 检测后的文本
    recognizeText: '',
    // 快捷键
    hotkey: {
      captureScreen: store.get<string>(StoreKey.HOT_KEY_CAPTURE_SCREEN, StoreDefault.DEFAULT_KEY_CAPTURE_SCREEN),
      captureWindow: store.get<string>(StoreKey.HOT_KEY_CAPTURE_WINDOW, StoreDefault.DEFAULT_KEY_CAPTURE_WINDOW)
    }
  },
  // getters: {
  //   test: () => () => store.get<string>(StoreKey.HOT_KEY_CAPTURE_SCREEN, StoreDefault.HOT_KEY_CAPTURE_SCREEN),
  //   test2: () => () => store.get<string>(StoreKey.HOT_KEY_CAPTURE_WINDOW, StoreDefault.HOT_KEY_CAPTURE_WINDOW)
  // },
  mutations: {
    [Mutations.MUTATION_RESULT_TEXT](state, payload: string) {
      state.recognizeText = payload
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
