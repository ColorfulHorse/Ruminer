import { RootConf } from './config/Conf'

declare module 'vue/types/vue' {
  interface Vue {
    $conf: RootConf
  }
}
