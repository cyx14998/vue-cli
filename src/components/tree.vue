// 左侧树状图 和tab
<template>
  <div class="tree">
    <div class="treeContainer">
      <el-tabs size="small" class="tab-header" v-model="activeName" type="card" @tab-click="tabChange">
        <el-tab-pane label="指标框架" name="indexFrame"></el-tab-pane>
        <el-tab-pane label="范围框架" name="scopeFrame"></el-tab-pane>
      </el-tabs>
      <el-tree v-show="activeName === 'indexFrame'" :data="data" node-key="nodeId" :expand-on-click-node="false"
        :props="defaultProps" :default-expanded-keys="defaultExpendKeys" @node-click="nodeClick">
      </el-tree>
      <el-tree v-show="activeName === 'scopeFrame'" :data="data" node-key="nodeId" :expand-on-click-node="false"
        :props="defaultProps" :default-expanded-keys="defaultExpendKeys" @node-click="nodeClick">
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tree",
  props: {
  },
  data () {
    return {
      id: 1,
      lastNodeList: new Map(),
      data: [],
      defaultProps: {
        children: "nodeInfo",
        label: "nodeName"
      },
      defaultExpendKeys: [],
      visible: false,
      filterText: "",
      activeName: 'indexFrame'
    };
  },
  computed: {
    newActiveName () {
      return this.$store.getters.getActiveName
    },
    browsersType () {
      return this.$store.getters.getBrowsersType
    }
  },
  watch: {
    // 监听框架切换
    newActiveName (val) {
      this.activeName = val
      this.$emit('getTableData')
    },
    // 监听浏览器类型改变
    browsersType () {
      this.getAllNodesById(this.id)
      this.$emit('getTableData')
    },
  },
  methods: {
    tabChange (e) {
      this.data = []
      if (e.name === 'indexFrame') {
        // 指标框架 调用接口
        this.id = 1
      } else {
        this.id = 2
        // 范围框架 调用接口
      }
      this.$store.dispatch('setActiveName', e.name)
      this.getAllNodesById(this.id)
    },
    getAllNodesById (nodeId) {
      //获取树的所有节点
      this.$api
        .get("/api/macroeconomy/menuTree/getAllNodesContainControlById", {
          nodeId: this.id
        })
        .then(({ data: { code, success, data } }) => {
          this.defaultExpendKeys = nodeId ? [Number(nodeId)] : [data.nodeId];
          this.data = [data];
        });
    },
    nodeClick ({ nodeId, controlId }) {
      console.log(nodeId)
    }
  },
  created () {
    this.getAllNodesById();
  }
};
</script>

<style scope lang="less">
.tab-header {
  width: 200px;
  margin-top: 15px;
}
.tree {
  .treeContainer {
    height: 100%;
    min-width: 200px;
    box-sizing: border-box;
    overflow-y: auto;
    .filterNode {
      padding: 0 9px 10px 8px;
      height: 28px;
      .el-input,
      input,
      i {
        height: 28px;
        line-height: 28px;
      }
    }
    .el-icon-pie-chart {
      font-size: 12px;
    }
  }
}
</style>