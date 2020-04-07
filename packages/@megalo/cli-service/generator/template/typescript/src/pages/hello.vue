<template>
  <div class="app">
      <img class="img" src="../static/imgs/megalo_logo.png" @touchstart="changeStat">
      <hello-world :color="color"></hello-world>
      <h1 class="txt" v-show="t%2==1">click logo::{{t}}</h1>
  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    HelloWorld
  }
})
export default class Hello extends Vue {
  t = 1
  color = '#007d37'

  async beforeCreate () {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('promise')
        resolve()
      }, 1000)
    })
    await p
    const map = new Map()
    map.set('name', '李宗')
    let x: number = 0
    const b = { age: 18 }
    console.log('Page [hello] Vue beforeCreate')
    // x = 'sb'
    console.log(x, { ...b }, map)
  }

  created () {
    console.log('Page [hello] Vue created')
    const appInstance: any = getApp()
    console.log(appInstance.globalData) // I am global data
  }

  beforeMount () {
    console.log('Page [hello] Vue beforeMount')
  }

  mounted () {
    console.log('Page [hello] Vue mounted')
  }

  onLoad (options) {
    // Do some initialize when page load.
    console.log('Page [hello] onLoad')
  }

  onReady () {
    // Do something when page ready.
    console.log('Page [hello] onReady')
  }

  onShow () {
    // Do something when page show.
    console.log('Page [hello] onShow')
  }

  onHide () {
    // Do something when page hide.
    console.log('Page [hello] onHide')
  }

  onUnload () {
    // Do something when page close.
    console.log('Page [hello] onUnload')
  }
  /**
   * for other event handlers, please check https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html
   */

  changeStat () {
    this.t++
    this.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
  }
}
</script>
<% if (rootOptions['cssPreProcessors']) { %>
<style lang="<%= cssPreset %>" scoped>
.app{
  padding-top: 100px;
  .img {
    display: block;
    height: 120px;
    width: 138px;
    margin: 20px auto;
  }
  .txt {
      color: #567567;
      font-size: 13px;
      text-align: center;
  }
}
</style><% } else { %>
<style scoped>
.app{
  padding-top: 100px;
}
.app .img {
  display: block;
  height: 120px;
  width: 138px;
  margin: 20px auto;
}
.app .txt {
  color: #567567;
  font-size: 13px;
  text-align: center;
}
</style><% } %>
