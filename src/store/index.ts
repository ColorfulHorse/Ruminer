import Vue from 'vue'
import Vuex from 'vuex'
import { Mutations } from '../constant/Constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 检测后的文本
    recognizeText: ''
  },
  mutations: {
    [Mutations.UPDATE_RESULT_TEXT](state, payload) {
      state.recognizeText = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
