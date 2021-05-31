// 范围||指标 框架路径 
<template>
  <div class="indicator modal zb-modal">
    <el-drawer :visible.sync="visible" :with-header="false" size="100%">
      <div class="zb-modal-header">
        <div class="zb-modal-header__title">
          <h3 class="zb-modal-header__text"><span>框架路径：{{routeData.route}}</span></h3>
        </div>
        <div class="zb-modal-header__append">
          <el-button size="small" @click="closeModal">返回框架配置</el-button>
        </div>
      </div>
      <div class="zb-modal-add">
        <el-button v-if="activeName === 'indexFrame'" type="primary" size="small" @click="indicatorModal(1,{})">新增指标
        </el-button>
        <el-button v-else type="primary" size="small" @click="rangeModal(1,{})">新增范围</el-button>
      </div>
      <div class="padding20">
        <el-table v-if="activeName === 'indexFrame'" :data="tableData" ref="zb_table" size="small" border
          v-loading="loading" class="zb-modal-table" :height="zb_tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column property="indexId" label="指标ID" width="150"></el-table-column>
          <el-table-column property="indexName" label="指标名称" width="300"></el-table-column>
          <el-table-column property="isDelete" label="状态">
            <template slot-scope="scope">{{ scope.row.isDelete !== 1 ? '启用' : '停用' }}</template>
          </el-table-column>
          <el-table-column property="sortBy" label="排序"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="indicatorModal(2,scope.row)">编辑</el-button>
              <el-button v-if="scope.row.isDelete !== 1" icon="el-icon-delete" class="delBtn" type="text"
                slot="reference" @click="changeNodeStatus(1,scope.row)">停用</el-button>
              <el-button v-else type="text" slot="reference" @click="changeNodeStatus(0,scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="tableData" ref="zb_table" size="small" border class="zb-modal-table" v-loading="loading"
          :height="zb_tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column property="name" label="范围名称" width="300"></el-table-column>
          <el-table-column property="filter" label="状态参数过滤条件" width="400"></el-table-column>
          <el-table-column property="isDelete" label="状态">
            <template slot-scope="scope">{{ scope.row.isDelete !== 1 ? '启用' : '停用' }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="rangeModal(2,scope.row)">编辑</el-button>
              <el-button icon="el-icon-delete" v-if="scope.row.nodeStatus === 1" class="delBtn" type="text"
                slot="reference" @click="changeNodeStatus(1,scope.row)">停用</el-button>
              <el-button type="text" v-else slot="reference" @click="changeNodeStatus(0,scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="el-row batch-withdraw" ref="zb_botAction">
          <el-col :span="8">
            <el-button type="primary" size="small" :disabled="!multipleSelection.length" @click="mulDel">批量删除
            </el-button>
          </el-col>
          <el-col :span="16" class="align-right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="pageParams.total">
            </el-pagination>
          </el-col>
        </div>
      </div>
      <IndicatorDialog v-if="indicatorDialogVisible" :visible="indicatorDialogVisible" @close="indicatorDialogClose"
        :indicatorData="indicatorData">
      </IndicatorDialog>
      <RangeDialog v-if="rangeDialogVisible" :visible="rangeDialogVisible" @close="rangeDialogClose"
        :rangeData="rangeData">
      </RangeDialog>
    </el-drawer>
  </div>
</template>

<script>
import IndicatorDialog from './indicatorDialog'
import RangeDialog from './rangeDialog'
import { mapState } from 'vuex'
export default {
  name: "Route",
  props: {
    visible: Boolean,
    routeData: Object
  },
  components: {
    IndicatorDialog,
    RangeDialog
  },
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      pageParams: { // 分页参数obj
        pageNo: 1,
        pageSize: 100,
        total: 0,
      },
      zb_tableHeight: 0,
      rangeDialogVisible: false, // 范围弹窗visible
      rangeData: {}, // 范围弹窗数据
      indicatorDialogVisible: false, // 指标弹窗visible
      indicatorData: {}, // 指标弹窗数据
      loading: false,
    };
  },
  created () {
  },
  computed: {
    ...mapState({
      activeName: 'activeName',
      browserType: 'browserType',
      nodeId: 'nodeId',
      route: 'route'
    })
  },
  watch: {

  },
  mounted () {
    this.getData()
    this.$nextTick(() => {
      if (this.$refs.zb_table.$el) {
        let bH = document.body.offsetHeight;
        let sH = this.$refs.zb_table.$el.getBoundingClientRect().top;
        let domH = this.$refs.zb_botAction.offsetHeight;
        this.zb_tableHeight = bH - sH - domH - 34
      }
    })
    let self = this
    window.onresize = () => {
      if (self.$refs.zb_table.$el) {
        let bH = document.body.offsetHeight;
        let sH = self.$refs.zb_table.$el.getBoundingClientRect().top;
        let domH = self.$refs.zb_botAction.offsetHeight;
        self.zb_tableHeight = bH - sH - domH - 34
      }
    }
  },
  methods: {
    getData () {
      this.multipleSelection = []
      const { pageNo, pageSize } = this.pageParams
      const { id } = this.routeData
      this.loading = true
      let url = ''
      if (this.activeName === 'indexFrame') {
        url = '/backapi/databrowser/systemIndexFrameRelationBack/getSystemIndexRelationByFrameId/' + id
      } else {
        url = '/backapi/databrowser/systemIndexFrameRelationBack/getSystemIndexRelationByFrameId/' + id
      }
      this.$http({
        url,
        method: 'get',
        params: {
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
    closeModal () {
      this.$emit('close')
    },
    // 范围 新增||编辑 弹窗
    rangeModal (flag, data) {
      this.rangeData = {
        ...data,
        flag,
        sortBy: flag === 2 ? '' + data.sortBy : 1,
        headTitle: flag === 1 ? '新增范围' : '编辑范围'
      }
      this.rangeDialogVisible = true
    },
    rangeDialogClose () {
      this.rangeDialogVisible = false
    },
    // 指标 新增||编辑 弹窗
    indicatorModal (flag, data) {
      const { id } = this.routeData
      this.indicatorData = {
        ...data,
        flag,
        frameId: id,
        sortBy: flag === 2 ? '' + data.sortBy : 1,
        headTitle: flag === 1 ? '新增指标' : '编辑指标'
      }
      this.indicatorDialogVisible = true
    },
    indicatorDialogClose () {
      this.indicatorDialogVisible = false
    },

    changeNodeStatus (flag, node) {
      this.loading = true
      const { id, indexId, indexName } = node
      this.$http({
        url: '/backapi/databrowser/systemIndexFrameRelationBack/updateSystemIndexRelation',
        method: 'post',
        params: {
          id,
          indexId,
          indexName,
          isDelete: flag,
        }
      }).then((res) => {
        this.loading = false
        if (res && res.success) {
          this.$message({
            type: 'success',
            message: res.message
          });
          this.getData()
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
      let message
      if (this.activeName === 'indexFrame') {
        message = '将删除所选指标，是否继续？'
      } else {
        message = '将删除所选范围，是否继续？'
      }
      this.$alert(message, '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if (action === 'confirm') {
            this.loading = true
            let ids = []
            this.multipleSelection.map(item => {
              ids.push(item.id)
            })
            this.$http({
              url: '/backapi/databrowser/systemIndexFrameRelationBack/delSystemIndexRelation',
              method: 'post',
              params: JSON.stringify(ids)
            }).then((res) => {
              this.loading = false
              if (res && res.success) {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.getData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            }).catch(() => {
              this.loading = false
            })
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.zb-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid #dcdfe6;
}
.zb-modal-add {
  height: 40px;
  line-height: 40px;
  text-align: right;
  padding: 0 16px;
  border-bottom: 1px solid #dcdfe6;
}
.zb-modal-table {
  margin-top: 10px;
}
.padding20 {
  padding: 20px;
}
.delBtn {
  color: red;
}
.batch-withdraw {
  margin-top: 10px;
}
.align-right {
  text-align: right;
}
</style>
