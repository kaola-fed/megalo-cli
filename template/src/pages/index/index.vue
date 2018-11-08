<template>
  <div class="app">
      <img class="img" src="https://user-images.githubusercontent.com/20720117/48007061-c516b380-e151-11e8-8dd0-cd1b0aaaef5f.png" @touchstart="changeStat">
      <hello-world :color="color"></hello-world>
      <h1 class="txt" v-show="t%2==1">click logo::{{t}}</h1>
      <a class="nav" url="/packageA/pages/test/index">跳转至分包 A</a>
      <a class="nav" url="/pages/packageB/pages/test/index">跳转至分包 B</a>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  mpType: 'page',
  components: {
      HelloWorld
  },
  data() {
    return {
      t: 1,
      color: '#007d37'
    }
  },
  created() {
  },
  methods:{
    changeStat: function(){
      this.t++
      this.color = '#'+Math.floor(Math.random()*0xffffff).toString(16)
    }
  }
}
</script>
<% if (cssPreset === 'less') { %>
<style lang="less" scoped>
<% } else if (cssPreset === 'stylus') {%>
<style lang="stylus" scoped>
<% } else {%>
<style lang="scss" scoped> 
<% } %>.app{
  padding-top: 100px;
  .img {
    display: block;
    height: 120px;
    width: 120px;
    margin: 20px auto;
  }
  .txt {
    color: #567567;
    font-size: 13px;
    text-align: center;
  }
  .nav {
    color: #008080;
    font-size: 15px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
