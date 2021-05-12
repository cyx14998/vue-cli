// 左侧树状图 和tab
<template>
  <div class="tree">
    <div class="treeContainer">
      <el-tree :data="data" node-key="nodeId" :expand-on-click-node="false" :props="defaultProps"
        :default-expanded-keys="defaultExpendKeys" @node-click="nodeClick">
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
      data: [],
      defaultProps: {
        children: "nodeInfo",
        label: "nodeName"
      },
      defaultExpendKeys: [],
    };
  },
  computed: {
    browsersType () {
      return this.$store.getters.getBrowsersType
    }
  },
  watch: {
    // 监听浏览器类型改变
    browsersType () {
      this.getAllNodesById(this.id)
      this.$emit('getTableData')
    },
  },
  methods: {
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
.tree {
  margin-top: 15px;
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