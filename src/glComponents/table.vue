// 右侧 table
<template>
  <div class="indexTable" ref="indexRef">
    <div class="action-btns marginb-10">
      <div>
        <el-button type="primary" size="small" @click="editNode(1,{})">新增框架</el-button>
        <el-button type="primary" size="small" @click="openRoute()">关联模板</el-button>
      </div>
    </div>
    <el-table border size="small" ref="multipleTable" :data="tableData" tooltip-effect="dark" v-loading="loading"
      :style="{width: '100%', height: tableHeight + 'px'}" :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="path" label="框架路径" align="center">
      </el-table-column>
      <el-table-column prop="level" label="层级" width="160" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.status ? '启用' : '停用' }}</template>
      </el-table-column>
      <el-table-column prop="sortNo" label="排序" width="50" align="center">
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editNode(2,scope.row)">编辑</el-button>
          <el-popconfirm class="marginl10 displayi-b" title="是否停用?" v-if="scope.row.status"
            @confirm="()=>{changeNodeStatus(1,scope.row)}">
            <el-button class="delBtn" type="text" slot="reference">停用</el-button>
          </el-popconfirm>
          <el-popconfirm class="marginl10 displayi-b" title="是否启用?" v-else
            @confirm="()=>{changeNodeStatus(2,scope.row)}">
            <el-button type="text" slot="reference">启用</el-button>
          </el-popconfirm>
          <el-popconfirm class="marginl10 displayi-b" title="是否删除?" @confirm="()=>{changeNodeStatus(3,scope.row)}">
            <el-button icon="el-icon-delete" class="delBtn" type="text" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="el-row batch-withdraw" ref="botAction">
      <el-col :span="8">
        <el-button type="primary" size="small" :disabled="!multipleSelection.length" @click="mulDel">批量删除</el-button>
      </el-col>
      <el-col :span="16" class="align-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageParams.total">
        </el-pagination>
      </el-col>
    </div>
    <Route v-if="routeVisible" :visible="routeVisible" @close="routeClose" :routeData="routeData" />
    <FrameDialog v-if="frameDialogVisible" :visible="frameDialogVisible" @close="frameDialogClose"
      :frameData="frameData" />
  </div>
</template>

<script>
import Route from './route'
import FrameDialog from './frameDialog'
export default {
  name: "TablePage",
  props: {
    tableHeight: Number
  },
  components: {
    Route,
    FrameDialog
  },
  data () {
    return {
      tableData: [],
      multipleSelection: [], // 多选
      pageParams: { // 分页参数obj
        pageNo: 1,
        pageSize: 100,
        total: 0,
      },
      routeVisible: false, // 指标 drawer
      routeData: null,
      frameDialogVisible: false, // 新增||编辑 框架dialog
      frameData: '', // 新增||编辑 传进去的数据
      loading: false,
    };
  },
  created () {

  },
  computed: {
    activeName () {
      return this.$store.getters.getActiveName
    },
    nodeId () {
      return this.$store.getters.getNodeId
    },
    browsersType () {
      return this.$store.getters.getBrowsersType
    },
  },
  watch: {
    nodeId () {
      this.getData()
    },
    // browsersType () {
    //   this.getData()
    // },
  },
  mounted () {
    // this.getData()
  },
  methods: {
    getData () {
      this.multipleSelection = []
      const { pageNo, pageSize } = this.pageParams
      this.loading = true
      this.$http({
        url: '/backapi/databrowser/glTemplate/loadFrameworkByPage',
        method: 'get',
        params: {
          sectionType: this.browsersType,
          id: this.nodeId,
          pageNo,
          pageSize,
        }
      }).then((res) => {
        this.loading = false
        if (res && res.success) {
          const { total, records } = res.data
          this.tableData = records
          this.pageParams = {
            ...this.pageParams,
            total,
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    routeClose () {
      this.routeVisible = false
    },
    frameDialogClose () {
      this.frameDialogVisible = false
    },
    editNode (flag, data) {
      this.frameData = {
        ...data,
        flag,
        sortNo: flag === 2 ? '' + data.sortNo : 1,
        headTitle: flag === 1 ? '新增框架' : '编辑框架'
      }
      this.frameDialogVisible = true
    },
    // 打开指标页面
    openRoute () {
      this.routeData = {
        id: this.nodeId
      }
      this.routeVisible = true
    },
    // 停用1||启用2||删除3
    changeNodeStatus (flag, node) {
      this.loading = true
      const { id, title, enName, sortNo } = node
      let url = ''
      let params = null
      let ids = [id]
      // 停用
      if (flag === 1) {
        url = '/backapi/databrowser/glTemplate/updateFramework'
        params = {
          id,
          title,
          enName,
          sortNo,
          parentId: this.nodeId,
          status: false,
          sectionType: this.browsersType,
        }
        // 启用
      } else if (flag === 2) {
        url = '/backapi/databrowser/glTemplate/updateFramework'
        params = {
          id,
          title,
          enName,
          sortNo,
          parentId: this.nodeId,
          status: true,
          sectionType: this.browsersType,
        }
        // 删除
      } else if (flag === 3) {
        url = '/backapi/databrowser/glTemplate/batchDeleteFramework'
        params = JSON.stringify(ids)
      }
      this.$http({
        url,
        method: 'post',
        params
      }).then((res) => {
        this.loading = false
        if (res && res.success) {
          this.$message.success(res.message);
          // 删除
          if (flag === 3) {
            this.$parent.$refs.nodeTree.dealDelNode([node])
          } else {
            // 切换状态（启用||停用）
            this.$parent.$refs.nodeTree.dealEditNode(res.data)
          }
          this.$nextTick(() => {
            this.getData()
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 每页显示多少 change
    handleSizeChange (val) {
      this.pageParams = {
        ...this.pageParams,
        pageSize: val
      }
      this.getData()
    },
    // 页码change
    handleCurrentChange (val) {
      this.pageParams = {
        ...this.pageParams,
        pageNo: val
      }
      this.getData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    changeLoading (flag) {
      this.loading = flag
    },
    mulDel () {
      this.$alert('是否确认删除选中框架?', '删除', {
        // showCancelButton: true,
        confirmButtonText: '确定',
        // cancelButtonText: '取消',
        callback: action => {
          if (action === 'confirm') {
            this.loading = true
            let ids = []
            this.multipleSelection.map(item => {
              ids.push(item.id)
            })
            this.$http({
              url: '/backapi/databrowser/glTemplate/batchDeleteFramework',
              method: 'post',
              params: JSON.stringify(ids)
            }).then((res) => {
              this.loading = false
              if (res && res.success) {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.$parent.$refs.nodeTree.dealDelNode(this.multipleSelection)
                this.$nextTick(() => {
                  this.getData()
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            })
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.action-btns {
  text-align: right;
}
.batch-withdraw {
  margin-top: 10px;
}
.align-right {
  text-align: right;
}
.delBtn.el-button {
  color: red;
  & + span {
    margin-left: 0;
  }
}
</style>
