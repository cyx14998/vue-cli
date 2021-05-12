<template>
  <div id="el-main">
    <diV id="left">
      <el-select v-model="value" placeholder="请选择" @change="onChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <Tree id="1" ref="nodeTree" @getTableData="getTableData" />
    </diV>
    <div id="right">
      <div v-if="showTable">
        <Table ref="tablePage" :tableHeight="tableHeight" />
      </div>
    </div>
  </div>
</template>

<script>
import Tree from "../glComponents/tree";
import Table from "../glComponents/table";
export default {
  components: {
    Tree,
    Table,
  },
  created () {
  },
  mounted () {
    this.showTable = true
    this.$nextTick(() => {
      let bH = document.body.offsetHeight;
      let sH = this.$refs.tablePage.$el.getBoundingClientRect().top;
      let domH = this.$refs.tablePage.$refs.botAction.offsetHeight;
      this.tableHeight = bH - sH - domH - 62
    })
    let self = this
    window.onresize = () => {
      let bH = document.body.offsetHeight;
      let sH = self.$refs.tablePage.$el.getBoundingClientRect().top;
      let domH = self.$refs.tablePage.$refs.botAction.offsetHeight;
      self.tableHeight = bH - sH - domH - 62
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
    onChange (val) {
      this.$store.dispatch('setBrowsersType', val)
      this.$store.dispatch('setActiveName', 'indexFrame')
    },
    getTableData () {
      this.$refs.tablePage.getData()
    },
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