// 支持iframe||引入组件 2种方式  组件方式容易造成store污染，不推荐
<template>
  <el-tabs class="app-tabs" v-model="tabIndex" @tab-click="handleClick" type="border-card">
    <el-tab-pane label="数据浏览器管理" name="1">
      <iframe v-if="activedIndex.indexOf(1) > -1" src="./#/index" frameborder="0" width="100%" height="100%"></iframe>
      <!-- <Index v-if="activedIndex.indexOf(1) > -1" /> -->
    </el-tab-pane>
    <el-tab-pane label="钢联模板管理" name="2">
      <iframe v-if="activedIndex.indexOf(2) > -1" src="./#/glIndex" frameborder="0" width="100%" height="100%"></iframe>
      <!-- <GlIndex v-if="activedIndex.indexOf(2) > -1" /> -->
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Index from './index'
import GlIndex from './glIndex'
export default {
  components: {
    Index,
    GlIndex
  },
  data () {
    return {
      tabIndex: '1',
      activedIndex: [1], // 激活过的index 默认是数据浏览器管理
    };
  },
  watch: {
  },
  methods: {
    handleClick (e) {
      this.activedIndex.push(+e.name)
    }
  },
  mounted () {
  },
  created () {
  },
  name: "App"
};
</script>

<style lang="less" scope>
#app {
  overflow: hidden;
}
.app-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-tabs__header {
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    margin: 0;
  }
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    padding: 0 20px !important;
  }
  .el-tab-pane {
    height: 100%;
  }
  .el-tabs__content {
    flex: 1;
    padding: 0;
  }
}
</style>
