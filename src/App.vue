<template>
  <div id="app">
    <router-view :draggable="false" class="tabs" />
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  watch: {
  },
  methods: {
    handleClick () {
    }
  },
  mounted () {
  },
  created () {
  },
  name: "App"
};
</script>

<style lang="less">
#app {
  height: 100%;
  font-size: 12px;
}
</style>
