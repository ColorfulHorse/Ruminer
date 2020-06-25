<template>
    <el-container id="home">
        <el-aside>
            <el-menu
                    :default-active="$route.path"
                    @select="handleSelect"
                    :background-color="colors.menuBg"
                    :text-color="colors.menuText"
                    :active-text-color="colors.menuActiveText"
                    router>
                <el-menu-item
                        v-for="item in $router.options.routes.find((value) => value.name==='Home').children"
                        :key="item.id"
                        :index="item.path">
                    <i :class="item.meta.icon"></i>
                    <span slot="title">{{item.meta.name}}</span>
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

  created() {
    this.$router.push('main')
  }

  handleSelect(key: string, keyPath: string) {
    console.log(key, keyPath)
    console.log(this.$route.path)
  }
}
</script>

<style scoped lang="scss">
    #home {
        height: 100%;
        width: 100%;

        .el-aside {
            width: 25% !important;
            height: 100%;
            .el-menu {
                height: 100%;
            }
        }

        .el-menu-item {
            padding: 0 15% !important;

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
