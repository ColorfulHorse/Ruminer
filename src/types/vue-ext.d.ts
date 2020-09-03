import { RootConf } from '@/config/Conf'
import { AppInfo } from '@/constant/Constants'
// global
declare module 'vue/types/vue' {
  interface Vue {
    $conf: RootConf
    $app: AppInfo
  }
}
