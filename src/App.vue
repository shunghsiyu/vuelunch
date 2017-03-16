<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@silver: #FBFBFB;

body {
  background-color: @silver;
}

* {
  padding: 0;
  margin: 0;
}

v-cloak {
  display: none;
}

#app {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
