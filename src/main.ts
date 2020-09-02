import './plugins/element.js'
import './assets/styles/base.scss'
import './assets/styles/common.scss'
import './assets/icons/iconfont.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import conf from './config/Conf'
import { appInfo } from '@/constant/Constants'

Vue.config.productionTip = false

Vue.config.keyCodes = {
  f12: 123
}

Vue.prototype.$conf = conf
Vue.prototype.$app = appInfo

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
