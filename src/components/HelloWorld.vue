<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      公共组件，全局可用
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
</style>
