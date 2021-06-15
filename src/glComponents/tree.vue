// 左侧树状图 和tab
<template>
  <div class="tree">
    <div class="treeContainer">
      <el-tree :data="data" ref="tree" node-key="id" :load="loadNode" lazy :expand-on-click-node="false"
        :props="defaultProps" @node-click="nodeClick" highlight-current>
        <span slot-scope="{ data }">
          <span>{{ data.title }}</span>
          <span v-if="!data.status" class="stop">（停）</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
/*eslint-disable */
import { mapState } from 'vuex'
export default {
  name: "Tree",
  props: {
  },
  data () {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "title",
        value: 'id'
      },
      node: undefined,
    };
  },
  computed: {
    ...mapState({
      activeName: 'activeName',
      browserType: 'browserType',
      nodeId: 'nodeId',
    })
  },
  watch: {
    // 监听浏览器类型改变 清空数据
    browserType () {
      this.node = undefined
      this.getAllNodesById()
      this.$emit('getTableData')
    },
  },
  methods: {
    getAllNodesById () {
      this.node = ''
      this.$parent.changeTreeLoading(true)
      //获取树的所有节点
      this.$http({
        url: '/backapi/databrowser/glTemplate/loadFrameworkTree',
        method: 'get',
        params: {
          sectionType: this.browserType,
          id: -1,
        }
      }).then((res) => {
        this.$parent.changeTreeLoading(false)
        if (res && res.success) {
          this.data = res.data
        }
      }).catch((err) => {
        this.$parent.changeTreeLoading(false)
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    // append方法在lazy模式下不起作用，只能用这种方式
    loadNode (node, resolve) {
      node.resolve = resolve;// 注意看这里
      if (node.level === 0) { // 正要但没创建根节点时
        node.resolve = resolve; // 注意看这里
        return resolve(this.data);
      }
      this.$http({
        url: '/backapi/databrowser/glTemplate/loadFrameworkTree',
        method: 'get',
        params: {
          sectionType: this.browserType,
          id: node.data.id,
        }
      }).then((res) => {
        if (res && res.success) {
          return resolve(res.data);
        }
      }).catch(() => { })
    },
    nodeClick (nodeObj, node) {
      this.$store.dispatch('setRoute', this.dealRoute(node, []))
      this.node = node
      this.$store.dispatch('setNodeId', nodeObj.id)
    },
    // 处理关联模板 框架路径
    dealRoute (node, route) {
      if (node.parent && node.parent != null) {
        route.unshift(node.label)
        this.dealRoute(node.parent, route)
      }
      return route.join("|")
    },
    // 新增框架后 处理tree（append方法在lazy模式下不起作用，只能用这种方式）
    dealAddNode (nodeObj) {
      let node = this.node
      if (node) {
        this.loadNode(node, node.resolve) // 调用接口方式更新tree 可以直接排序
        // let children = [];
        // children.push(nodeObj);
        // node.childNodes.forEach(d => children.push(d.data));
        // node.resolve && node.resolve(children); // 不调用接口更新tree 但是没法排序
      } else {
        this.getAllNodesById()
      }
    },
    // 编辑框架
    dealEditNode (nodeObj) {
      // this.$refs.tree.remove(nodeObj)
      this.dealAddNode(nodeObj)
    },
    // 批量删除后 处理tree
    dealDelNode (nodeArr) {
      nodeArr.map(item => {
        this.$refs.tree.remove(item)
      })
    }
  },
  created () {
  }
};
</script>

<style scope lang="less">
.tree {
  margin-top: 15px;
  .stop {
    color: red;
  }
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