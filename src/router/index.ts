import VueRouter, { RouteConfig } from 'vue-router'
import Vue from 'vue'
import conf from '@/config/Conf'
import { Platform } from '@/constant/Constants'
import CommonUtil from '@/utils/CommonUtil'
const Home = () => import('@/views/Home.vue')
const Main = () => import('@/views/Main.vue')
const KeyMap = () => import('@/views/KeyMap.vue')
const Config = () => import('@/views/Config.vue')
const BaiduConfig = () => import('@/views/BaiduConfig.vue')
const TxConfig = () => import('@/views/TxConfig.vue')
const Overlay = () => import('@/views/Overlay.vue')
const Content = () => import('@/views/Content.vue')
const Select = () => import('@/views/Select.vue')
const ContentSetting = () => import('@/views/ContentSetting.vue')

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    redirect: () => {
      if (CommonUtil.checkConfig()) {
        return '/main/home'
      } else {
        return '/main/config'
      }
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          name: '主页',
          icon: 'el-icon-house',
          navPath: 'home'
        }
      },
      {
        path: 'config',
        name: 'Config',
        component: Config,
        redirect: () => {
          const index = conf.translate.get('platform')
          let route = 'BaiduConfig'
          switch (index) {
            case Platform.tencent:
              route = 'TxConfig'
              break
          }
          return {name: route}
        },
        meta: {
          name: '配置',
          icon: 'el-icon-setting',
          navPath: 'config'
        },
        children: [
          {
            path: 'baidu-config',
            name: 'BaiduConfig',
            component: BaiduConfig,
            meta: {
              navPath: 'config'
            }
          },
          {
            path: 'tx-config',
            name: 'TxConfig',
            component: TxConfig,
            meta: {
              navPath: 'config'
            }
          }
        ]
      },
      {
        path: 'keymap',
        name: 'KeyMap',
        component: KeyMap,
        meta: {
          name: '快捷键',
          icon: 'el-icon-jianpan',
          navPath: 'keymap'
        }
      },
      {
        path: 'content-style',
        name: 'content-style',
        component: ContentSetting,
        meta: {
          name: '显示设置',
          icon: 'el-icon-style',
          navPath: 'content-style'
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
  mode: 'hash',
  routes
})

export default router
