<template>
    <el-container id="home">
        <el-aside >
            <el-menu
                    @select="menuSelect"
                    :default-active="$route.path"
                    :background-color="colors.menuBg"
                    :text-color="colors.menuText"
                    :active-text-color="colors.menuActiveText"
                    router>
                <el-menu-item
                        v-for="item in $router.options.routes.find((value) => value.name==='Home').children"
                        :key="item.id"
                        :index="item.path">
                  <div :class="currentIndex===item.path?'el-menu-item-wrapper-checked':'el-menu-item-wrapper-checkable'">
                    <span slot="title">{{item.meta.name}}</span>
                  </div>
                </el-menu-item>
                <!--                <el-menu-item index="main">-->
                <!--                    <i class="el-icon-house"></i>-->
                <!--                    <span slot="title">主页</span>-->
                <!--                </el-menu-item>-->
                <!--                <el-menu-item index="config">-->
                <!--                    <i class="el-icon-setting"></i>-->
                <!--                    <span slot="title">配置</span>-->
                <!--                </el-menu-item>-->
                <!--                <el-menu-item index="keymap">-->
                <!--                    <i class="custom-icon-jianpan"></i>-->
                <!--                    <span slot="title">快捷键</span>-->
                <!--                </el-menu-item>-->
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
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator'
import colors from '@/styles/colors.scss'

@Component
export default class Home extends Vue {
  colors = colors

  currentIndex= ''

  data() {
    return {
      currentIndex: '/main' // 默认给的是哪个就给哪个的path
    }
  }

  menuSelect(item:string) {
    this.currentIndex = item
  }
}
</script>

<style scoped lang="scss">
    #home {
        height: 100%;
        width: 100%;

        .el-aside {
          background: #F1F1F1;
            width: 25% !important;
            height: 100%;
            .el-menu {
              height: 100%;
              width: 100%;
            }
        }
        .el-menu-item {
            padding:0 !important;
            .el-menu-item-wrapper-checkable{
              width: 100%;
              background: #F1F1F1;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .el-menu-item-wrapper-checked{
              width: 100%;
              background: #FFFFFF;
              display: flex;
              font-weight: 700;
              justify-content: center;
              align-items: center;
              border-top: 1px solid #DCDCDC;
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
</style>
