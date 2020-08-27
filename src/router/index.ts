import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import Main from '@/views/Main.vue'
import KeyMap from '@/views/KeyMap.vue'
import Config from '@/views/Config.vue'
import Overlay from '@/views/Overlay.vue'
import Content from '@/views/Content.vue'
import Select from '@/views/Select.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'main',
        name: 'Main',
        component: Main,
        meta: {
          name: '主页',
          icon: 'el-icon-house',
          subPath: 'main'
        }
      },
      {
        path: 'config',
        name: 'Config',
        component: Config,
        meta: {
          name: '配置',
          icon: 'el-icon-setting',
          subPath: 'config'
        }
      },
      {
        path: 'keymap',
        name: 'KeyMap',
        component: KeyMap,
        meta: {
          name: '快捷键',
          icon: 'el-icon-jianpan',
          subPath: 'keymap'
        }
      }
    ]
  },
  {
    path: '/overlay',
    name: 'Overlay',
    component: Overlay
  },
  {
    path: '/content',
    name: 'Content',
    component: Content
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  }
]

const router = new VueRouter({
  routes
})

export default router
