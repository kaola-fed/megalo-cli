<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

declare module 'megalo/types/vue' {
  interface Vue {
    $mp: any
  }
}

// https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html
Component.registerHooks([
  'onLaunch', // 初始化
  'onShow', // 当小程序启动，或从后台进入前台显示
  'onHide', // 当小程序从前台进入后台
  'onError', // 错误监听函数
  'onPageNotFound', // 页面不存在监听函数
  'globalData'
])

@Component({
  mpType: 'app'
} as any)
class App extends Vue {
  onLaunch (options) {
    // Do something initial when launch.
    console.log('App onLaunch, env文件自定义的环境变量VUE_APP_TEST值:', process.env.VUE_APP_TEST)
  }

  onShow (options) {
    // Do something when show.
    console.log('App onShow')
  }

  onHide () {
    // Do something when hide.
    console.log('App onHide')
  }

  onError (msg) {
    console.log('App onError')
    console.log(msg)
  }

  globalData () {
    return {
      a: 'I am global data'
    }
  }
}

export default App
</script>
