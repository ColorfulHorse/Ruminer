<template>
    <el-container id="home">
        <el-header height="30px">
            <div class="title">
                {{ $app.name }} - {{ version }}
            </div>
            <div class="actions">
                <i class="el-icon-minus" @click="minimize"></i>
                <i class="el-icon-close" @click="close"></i>
            </div>
        </el-header>
        <el-container>
          <el-aside>
            <el-menu
                :default-active="$route.meta.subPath"
                :background-color="colors.menuBg"
                :text-color="colors.menuText"
                :active-text-color="colors.menuActiveText"
                :unique-opened="true"
                router>
              <el-menu-item
                  v-for="item in $router.options.routes.find((value) => value.name==='Home').children"
                  :key="item.id"
                  :index="item.path">
                <i :class="item.meta.icon"></i>
                <span slot="title">{{item.meta.name}}</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
            <transition name="fade-transform" mode="out-in">
              <keep-alive>
                <router-view></router-view>
              </keep-alive>
            </transition>
          </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator'
import colors from '@/assets/styles/colors.scss'
import { ipcRenderer, remote } from 'electron'
import { KEYS } from '@/electron/event/IPC'
import pkg from 'root/package.json'

@Component({
  name: 'Home'
})
export default class Home extends Vue {
  colors = colors
  version = process.env.NODE_ENV === 'production' ? pkg.version : 'Dev'

  created() {
    this.$router.push('main')
    ipcRenderer.on(KEYS.ROUTE_API_CONFIG, () => {
      this.$router.push('config')
    })
  }

  minimize() {
    remote.BrowserWindow.getFocusedWindow()?.minimize()
  }

  close() {
    const win = remote.BrowserWindow.getFocusedWindow()
    win?.setSkipTaskbar(true)
    win?.hide()
  }
}
</script>

<style scoped lang="scss">
  #home {
    height: 100%;
    width: 100%;

    .el-header {
      position: relative;
      -webkit-app-region: drag;

      .title {
        width: 100%;
        height: 30px;
        text-align: center;
        color: $main-text;
        font-size: 14px;
        padding: 0 5px;
        line-height: 30px;
      }
      .actions {
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        margin-right: 5px;
      }
      i {
        font-size: 18px;
        padding: 5px;
        color: $main-text;
        cursor: pointer;
        -webkit-app-region: no-drag;
      }
      .el-icon-minus:hover {
        color: #409EFF;
      }
      .el-icon-close:hover {
        color: #F15140;
      }
    }

    .el-aside {
      width: 25% !important;
      height: 100%;
      .el-menu {
        height: 100%;
        border-right: none;
        &-item {
          padding: 0 15% !important;
          &.is-active:before {
            content: '';
            position: absolute;
            width: 3px;
            height: 20px;
            right: 0;
            top: 18px;
            background: $menuActiveText;
          }

          [class^="el-icon-"] {
            margin-right: 16px;
            width: 24px;
            text-align: center;
            font-size: 20px;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
