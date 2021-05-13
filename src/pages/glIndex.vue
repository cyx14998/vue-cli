<template>
  <div id="el-main">
    <diV id="left">
      <el-select v-model="value" placeholder="请选择" @change="onChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <Tree ref="nodeTree" @getTableData="getTableData" />
    </diV>
    <div id="right">
      <Table v-if="showTable" ref="tablePage" :tableHeight="tableHeight" />
    </div>
  </div>
</template>

<script>
import Tree from "../glComponents/tree"
import Table from "../glComponents/table"

export default {
  components: {
    Tree,
    Table,
  },
  data () {
    return {
      showTable: false,
      options: [],
      value: '',
      tableHeight: 0,
    };
  },
  created () {
  },
  mounted () {
    this.getSelectData()
    this.showTable = true
    this.$nextTick(() => {
      let bH = document.body.offsetHeight
      let sH = this.$refs.tablePage.$el.getBoundingClientRect().top
      let domH = this.$refs.tablePage.$refs.botAction.offsetHeight
      this.tableHeight = bH - sH - domH - 82
    })
    let self = this
    window.onresize = () => {
      let bH = document.body.offsetHeight
      let sH = self.$refs.tablePage.$el.getBoundingClientRect().top
      let domH = self.$refs.tablePage.$refs.botAction.offsetHeight
      self.tableHeight = bH - sH - domH - 82
    }
  },
  methods: {
    getSelectData () {
      this.$http({
        url: '/api/databrowser/glTemplate/loadSectionSelectList',
        method: 'get',
      }).then((res) => {
        if (res && res.success) {
          this.options = res.data
          if (res.data && res.data.length) {
            this.value = res.data[0].id
            this.$store.dispatch('setBrowsersType', res.data[0].id)
            this.$store.dispatch('setRoute', res.data[0].name)
          }
        } else {
          this.$message.error(res.message || '获取下拉框板块出错!')
        }
      });
    },
    onChange (val) {
      this.$store.dispatch('setNodeId', -1)
      this.$store.dispatch('setBrowsersType', val)
      let route = ''
      this.options.map(item=>{
        if(item.id === val){
          route = item.name
        }
      })
      this.$store.dispatch('setRoute', route)
    },
    getTableData () {
      this.$refs.tablePage.getData()
    },
    refreshTree (nodeId) {
      this.$refs.nodeTree.getAllNodesById(nodeId)
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