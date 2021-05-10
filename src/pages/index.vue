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
      <Search ref="search" />
      <div v-if="showTable">
        <IndexFrame ref="frame" :tableHeight="tableHeight" />
      </div>
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
    IndexFrame,
  },
  created () {
  },
  mounted () {
    this.showTable = true
    this.$nextTick(() => {
      let bH = document.body.offsetHeight;
      let sH = this.$refs.frame.$el.getBoundingClientRect().top;
      let domH = this.$refs.frame.$refs.botAction.offsetHeight;
      this.tableHeight = bH - sH - domH - 34
    })
    let self = this
    window.onresize = () => {
      let bH = document.body.offsetHeight;
      let sH = self.$refs.frame.$el.getBoundingClientRect().top;
      let domH = self.$refs.frame.$refs.botAction.offsetHeight;
      self.tableHeight = bH - sH - domH - 34
    }
  },
  data () {
    return {
      showTable: false,
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
      value: '1',
      tableHeight: 0,
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
    min-width: 500px;
    overflow-y: hidden;
  }
}
</style>