<template>
  <div id="el-main">
    <diV id="left">
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <Tree id="1" ref="nodeTree" />
    </diV>
    <div id="right">
      <Search />
      <IndexFrame ref="indexFrame" />
    </div>
  </div>
</template>

<script>
import Tree from "../components/tree.vue";
import Search from "../components/search.vue";
import IndexFrame from "../components/indexFrame.vue";
export default {
  components: {
    Tree,
    Search,
    IndexFrame
  },
  mounted () {
  },
  data () {
    return {
      options: [{
        value: '1',
        label: '期货数据浏览器'
      }, {
        value: '2',
        label: '行情数据浏览器'
      }, {
        value: '3',
        label: '宏观数据浏览器'
      }],
      value: '1'
    };
  },
  methods: {
    refreshTree (nodeId) {
      this.$refs.nodeTree.getAllNodesById(nodeId);
    }
  }
};
</script>

<style lang="less" scope>
#el-main {
  display: flex;
  flex: 1;
  height: 100%;
  padding: 12px;
  overflow: auto;
  box-sizing: border-box;
  #left {
    min-width: 200px;
    padding: 10px;
    border-right: 1px solid #e4e7ed;
    overflow: auto;
    border-right: 1px solid #e4e7ed;
  }
  #right {
    padding: 10px;
    flex: 1;
    overflow: auto;
  }
}
</style>