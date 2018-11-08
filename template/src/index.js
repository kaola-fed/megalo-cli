import App from './App'
import Vue from 'vue'
import VHtmlPlugin from '@megalo/vhtml-plugin'

Vue.use(VHtmlPlugin)

const app = new Vue(App)

app.$mount()

export default {
  config: {
    // 放在首页的页面，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/index/index'
    ],
    subpackages: [{
        root: 'packageA',
        pages: [
          'pages/test/index',
        ]
      },
      {
        root: 'pages/packageB',
        pages: [
          'pages/test/index',
        ]
      }
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '<%- projectName %>',
      navigationBarTextStyle: 'black'
    }
  }
}