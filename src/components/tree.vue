// 左侧树状图 和tab
<template>
  <div class="tree">
    <div class="treeContainer">
      <el-tabs size="small" class="tab-header" v-model="activeName" type="card" @tab-click="tabChange">
        <el-tab-pane label="指标框架" name="indexFrame"></el-tab-pane>
        <el-tab-pane label="范围框架" name="scopeFrame"></el-tab-pane>
      </el-tabs>
      <el-tree v-show="activeName === 'indexFrame'" :data="indexData" ref="indexTree" node-key="id"
        :load="loadIndexNode" lazy :props="defaultProps" @node-click="nodeClick" highlight-current>
        <span slot-scope="{ data }">
          <span>{{ data.frameName }}</span>
          <!-- <span v-if="!data.status" class="stop">（停）</span> -->
        </span>
      </el-tree>
      <el-tree v-show="activeName === 'scopeFrame'" :data="scopeData" ref="scopeTree" node-key="id"
        :load="loadScopeNode" lazy :props="defaultProps" @node-click="nodeClick" highlight-current>
        <span slot-scope="{ data }">
          <span>{{ data.frameName }}</span>
          <!-- <span v-if="!data.status" class="stop">（停）</span> -->
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "Tree",
  props: {
  },
  data () {
    return {
      indexData: [],
      scopeData: [],
      defaultProps: {
        isLeaf: 'leaf',
        children: "nodeInfo",
        label: "nodeName"
      },
      visible: false,
      activeName: 'indexFrame',
      node: ''
    };
  },
  computed: {
    ...mapState({
      newActiveName: 'activeName',
      browsersType: 'browsersType',
      nodeId: 'nodeId'
    })
  },
  watch: {
    // 监听浏览器类型改变
    browsersType () {
      this.activeName = 'indexFrame'
      this.getAllNodesById(this.id)
      this.$emit('getTableData')
    },
  },
  methods: {
    tabChange (e) {
      this.activeName = e.name
      this.$store.dispatch('setActiveName', e.name)
      this.$store.dispatch('setNodeId', -1)
      this.$store.dispatch('setIsLeaf', 0)
      this.$store.dispatch("setFilterParams", { frameName: '', isDelete: '-1' })
      this.$nextTick(() => {
        this.getAllNodesById(this.id)
        this.$parent.$refs.search.resetForm()
        this.$parent.$refs.tablePage.getData(1)
      })
    },
    //获取树的所有节点
    getAllNodesById () {
      this.node = ''
      this.$parent.changeTreeLoading(true)
      let url = ''
      let params = {}
      if (this.activeName === 'indexFrame') {
        url = '/backapi/databrowser/systemIndexFrameBack/getSystemFrameListByParentId'
        params = {
          browserType: this.browsersType,
          parentId: -1,
        }
      } else {
        url = '/backapi/databrowser/rangeFrameBack/getRangeFrameByParentId'
        params = {
          browserType: this.browsersType,
          parentId: -1,
        }
      }
      this.$http({
        url,
        method: 'get',
        params
      }).then((res) => {
        this.$parent.changeTreeLoading(false)
        if (res && res.success) {
          res.data && res.data.length ? res.data.map((item) => {
            if (item.isLeaf === 1) {
              item.leaf = true
            }
          }) : ''
          if (this.activeName === 'indexFrame') {
            this.indexData = res.data
          } else {
            this.scopeData = res.data
          }
        } else {
          this.$message.error(res.message || '获取tree数据出错!')
        }
      }).catch(() => { this.$parent.changeTreeLoading(false) })
    },
    // append方法在lazy模式下不起作用，只能用这种方式
    loadIndexNode (node, resolve) {
      node.resolve = resolve;// 注意看这里
      if (node.level === 0) { // 正要但没创建根节点时
        node.resolve = resolve; // 注意看这里
        return resolve(this.indexData);
      }
      this.$http({
        url: '/backapi/databrowser/systemIndexFrameBack/getSystemFrameListByParentId',
        method: 'get',
        params: {
          browserType: this.browsersType,
          parentId: node.data.id,
        }
      }).then((res) => {
        if (res && res.success) {
          res.data && res.data.length ? res.data.map((item) => {
            if (item.isLeaf === 1) {
              item.leaf = true
            }
          }) : ''
          return resolve(res.data);
        } else {
          this.$message.error(res.message || '获取指标框架出错!')
        }
      })
    },
    // append方法在lazy模式下不起作用，只能用这种方式
    loadScopeNode (node, resolve) {
      node.resolve = resolve;// 注意看这里
      if (node.level === 0) { // 正要但没创建根节点时
        node.resolve = resolve; // 注意看这里
        return resolve(this.scopeData);
      }
      this.$http({
        url: '/backapi/databrowser/rangeFrameBack/getRangeFrameByParentId',
        method: 'get',
        params: {
          browserType: this.browsersType,
          parentId: node.data.id,
        }
      }).then((res) => {
        if (res && res.success) {
          res.data && res.data.length ? res.data.map((item) => {
            if (item.isLeaf === 1) {
              item.leaf = true
            }
          }) : ''
          return resolve(res.data);
        } else {
          this.$message.error(res.message || '获取范围框架出错!')
        }
      })
    },
    nodeClick (nodeObj, node) {
      this.node = node
      this.$store.dispatch('setRoute', this.dealRoute(node, []))
      this.$store.dispatch("setFilterParams", { frameName: '', isDelete: '-1' })
      this.$store.dispatch('setNodeId', nodeObj.id)
      this.$store.dispatch('setIsLeaf', nodeObj.isLeaf)
      this.$nextTick(() => {
        this.$parent.$refs.search.resetForm()
        this.$parent.$refs.tablePage.getData(1)
      })
    },
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
        if (this.activeName === 'indexFrame') {
          this.loadIndexNode(node, node.resolve) // 调用接口方式更新tree 可以直接排序
        } else {
          this.loadScopeNode(node, node.resolve) // 调用接口方式更新tree 可以直接排序
        }
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
      if (this.activeName === 'indexFrame') {
        nodeArr.map(item => {
          this.$refs.indexTree.remove(item)
        })
      } else {
        nodeArr.map(item => {
          this.$refs.scopeTree.remove(item)
        })
      }
    }
  },
  created () {
    this.getAllNodesById()
  }
};
</script>

<style scope lang="less">
.tab-header {
  width: 200px;
  margin-top: 15px;

  .el-tabs__nav {
    width: 100%;
  }

  .el-tabs__nav .el-tabs__item {
    width: 50%;
    height: 28px;
    line-height: 28px;
  }
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