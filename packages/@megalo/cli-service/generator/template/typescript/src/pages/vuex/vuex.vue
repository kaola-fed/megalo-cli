<config lang="json">
{
  navigationBarTitleText: 'vuex示例',
  usingComponents: {

  }
}
</config>

<template>
  <div id="app">
    Clicked: {{ $store.state.counter.count }} times, count is {{ evenOrOdd }}.
    <button @click="increment()|test()">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">Increment if odd</button>
    <button @click="incrementAsync">Increment async</button>
    globalData:{{ globalData }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

@Component
export default class Vuex extends Vue {
  globalData = {}

  @Getter evenOrOdd
  @Action increment
  @Action decrement
  @Action incrementIfOdd
  @Action incrementAsync

  test () {
    console.log(this.globalData['a'])
  }

  created () {
    const appInstance: any = getApp()
    this.globalData = appInstance.globalData
  }
}
</script>
