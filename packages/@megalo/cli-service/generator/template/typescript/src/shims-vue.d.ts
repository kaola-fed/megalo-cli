import Vue from 'vue'
import 'miniprogram-api-typings'
import '@types/node'

declare module '*.vue' {
  export default Vue
}

declare module 'megalo/types/vue' {
  interface Vue {
    $mp: any
  }
}
