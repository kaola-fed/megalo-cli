<template>
  <div class="hello">
    <h1 :style="'color:'+color">{{ msg }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop(String) color
  @Prop({ default: 'Welcome to Megalo' }) msg
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    font-size: 16px;
    text-align: center;
  }
</style>
