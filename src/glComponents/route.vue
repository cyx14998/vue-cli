// 范围||指标 框架路径 
<template>
  <div class="indicator modal zb-modal">
    <el-drawer :visible.sync="visible" :with-header="false" size="100%">
      <div class="zb-modal-header">
        <div class="zb-modal-header__title">
          <h3 class="zb-modal-header__text"><span>框架路径：{{route}}</span></h3>
        </div>
        <div class="zb-modal-header__append">
          <el-button size="small" @click="closeModal">返回</el-button>
          <el-button type="primary" size="small" @click="indicatorModal(1,{})">新增模板</el-button>
        </div>
      </div>
      <div class="padding20">
        <el-table :data="tableData" ref="zb_table" size="small" border class="zb-modal-table" :height="zb_tableHeight"
          v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column property="title" label="模板名称" align="center"></el-table-column>
          <el-table-column property="sortNo" label="框架内顺序" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="indicatorModal(2,scope.row)">编辑</el-button>
              <el-popconfirm class="marginl10 displayi-b" title="是否删除?" v-if="scope.row.nodeStatus != 1"
                @confirm="()=>{changeNodeStatus(scope.row)}">
                <el-button icon="el-icon-delete" class="delBtn" type="text" slot="reference">删除</el-button>
              </el-popconfirm>
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
      <TemplateDialog v-if="templateDialogVisible" :visible="templateDialogVisible" @close="templateDialogClose"
        :templateData="templateData">
      </TemplateDialog>
    </el-drawer>
  </div>
</template>

<script>
import TemplateDialog from './templateDialog'
export default {
  name: "RoutePage",
  props: {
    visible: Boolean,
    routeData: Object
  },
  components: {
    TemplateDialog,
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
      zb_tableHeight: 0,
      templateDialogVisible: false, // 弹窗visible
      templateData: {}, // 弹窗数据
      loading: false,
    };
  },
  created () {
  },
  computed: {
    nodeId () {
      return this.$store.getters.getNodeId
    },
    route () {
      return this.$store.getters.getRoute
    },
    browsersType () {
      return this.$store.getters.getBrowsersType
    },
  },
  mounted () {
    this.getData()
    this.$nextTick(() => {
      let bH = document.body.offsetHeight;
      let sH = this.$refs.zb_table.$el.getBoundingClientRect().top;
      let domH = this.$refs.zb_botAction.offsetHeight;
      this.zb_tableHeight = bH - sH - domH - 34
    })
    let self = this
    window.onresize = () => {
      let bH = document.body.offsetHeight;
      let sH = this.$refs.zb_table.$el.getBoundingClientRect().top;
      let domH = self.$refs.zb_botAction.offsetHeight;
      self.zb_tableHeight = bH - sH - domH - 34
    }
  },
  methods: {
    getData () {
      this.multipleSelection = []
      const { pageNo, pageSize } = this.pageParams
      this.loading = true
      this.$http({
        url: '/api/databrowser/glTemplate/listPageGlTemplateByFrameworkId',
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
    closeModal () {
      this.$emit('close')
    },
    // 模板新增||编辑 弹窗
    indicatorModal (flag, data) {
      this.templateData = {
        ...data,
        flag,
        sortNo: flag === 2 ? '' + data.sortNo : 1,
        templateFile: null,
        headTitle: flag === 1 ? '新增框架' : '编辑框架'
      }
      this.templateDialogVisible = true
    },
    templateDialogClose () {
      this.templateDialogVisible = false
    },

    changeNodeStatus (node) {
      this.loading = true
      this.$http({
        url: '/api/databrowser/glTemplate/batchDeleteGlTemplate',
        method: 'post',
        params: JSON.stringify([node.id])
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
      this.$alert('是否删除?', '删除', {
        // showCancelButton: true,
        confirmButtonText: '确定',
        // cancelButtonText: '取消',
        callback: action => {
          this.loading = true
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.id)
          })
          if (action === 'confirm') {
            this.$http({
              url: '/api/databrowser/glTemplate/batchDeleteGlTemplate',
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
