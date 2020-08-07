declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// declare module 'vue/types/vue' {
//   import { RootConf } from './config/Conf'
//   import ElectronStore from 'electron-store'
//   interface Vue {
//     $conf: ElectronStore<RootConf>
//   }
// }

declare module '*.css' {
}
declare module '*.scss' {
}
