// 右侧 table
<template>
  <div class="indexTable" ref="indexRef">
    <div class="action-btns marginb-10">
      <div class="btn-flex">
        <el-button size="small">
          <el-link :underline="false" :href="downLoadUrl" target="_self">框架模板下载</el-link>
        </el-button>
        <el-button type="primary" size="small" @click="importTemplate">框架导入</el-button>
      </div>
      <div>
        <el-button type="primary" size="small" @click="editNode(1,{})">新增框架</el-button>
      </div>
    </div>
    <el-table border size="small" ref="multipleTable" :data="tableData" tooltip-effect="dark" v-loading="loading"
      :style="{width: '100%', height: tableHeight + 'px'}" :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="框架ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="cnName" label="框架中文名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enName" label="框架英文名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="route" label="框架路径">
      </el-table-column>
      <el-table-column prop="isLeaf" label="是否叶子节点" width="106">
        <template slot-scope="scope">{{ scope.row.isLeaf ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="50">
        <template slot-scope="scope">{{ scope.row.status === 1 ? '启用' : '停用' }}</template>
      </el-table-column>
      <el-table-column prop="sortNo" label="排序" width="50">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="editNode(2,scope.row)">编辑</el-button>
          <el-button class="marginl10" type="text" v-if="activeName === 'indexFrame'" @click="openRoute(scope.row)">指标
          </el-button>
          <el-button type="text" v-else @click="openRoute(scope.row)">范围</el-button>
          <el-popconfirm class="marginl10 displayi-b" title="是否停用?" v-if="scope.row.nodeStatus != 1"
            @confirm="()=>{changeNodeStatus(1,scope.row)}">
            <el-button icon="el-icon-delete" class="delBtn" type="text" slot="reference">停用</el-button>
          </el-popconfirm>
          <el-popconfirm class="marginl10 displayi-b" title="是否启用?" v-else
            @confirm="()=>{changeNodeStatus(2,scope.row)}">
            <el-button type="text" slot="reference">启用</el-button>
          </el-popconfirm>
          <!-- <el-button icon="el-icon-delete" class="delBtn" type="text" v-if="scope.row.nodeStatus != 1"
            @click="changeNodeStatus(scope.row)">停用</el-button>
          <el-button type="text" v-else @click="changeNodeStatus(scope.row)">启用</el-button> -->
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
    <input style="width:0px;height:0px;" id="exportTemplate" type="file" accept=".xlsx,.xls" ref="exportBtn"
      @change="importFileChange" />
  </div>
</template>

<script>
import Route from './route'
import FrameDialog from './frameDialog'
import baseUrl from '../utils/env'

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
      downLoadUrl: baseUrl + '/backapi/databrowser/systemIndexFrameBack/download',
      tableData: [{
        id: 110100000000,
        title: '基本资料',
        enName: 'base data',
        route: '指标框架|第二层',
        isLeaf: 1,
        status: 1,
        sortNo: 1
      }],
      multipleSelection: [],
      pageParams: { // 分页参数obj
        pageNo: 1,
        pageSize: 100,
        total: 0,
      },
      routeVisible: false, // 指标||范围 drawer
      routeData: {}, // 
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
  },
  watch: {
    nodeId () {
      this.getData()
    },
  },
  mounted () {
    // this.getData()
  },
  methods: {
    getData () {
      this.multipleSelection = []
      const filterParams = this.$store.getters.getFilterParams
      console.log(filterParams)
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
    // 导入框架
    importTemplate () {
      let btn = this.$refs.exportBtn;
      btn.value = "";
      btn.click();
    },
    importFileChange (e) {
      let self = this
      try {
        this.changeLoading(true)

        let url = '/backapi/databrowser/systemIndexFrameBack/upload?browserType=1&parentId=-1'
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$axios.post(url, formData, config)
          .then(function (res) {
            self.changeLoading(false)
            if (res.data && res.data.success) {
              self.$message({
                type: 'success',
                message: res.data.message
              })
              self.$nextTick(() => {
                self.getData()
              })
            } else {
              self.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
          .catch((res) => {
            self.$message({
              type: 'error',
              message: res
            })
            self.changeLoading(false)
          })
      } catch (e) {
        console.error(e)
      }
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
        isLeaf: flag === 2 ? '' + data.isLeaf : '',
        flag,
        sortNo: flag === 2 ? '' + data.sortNo : 1,
        headTitle: flag === 1 ? '新增框架' : '编辑框架'
      }
      this.frameDialogVisible = true
    },
    // 打开指标||范围页面
    openRoute (data) {
      this.routeData = {
        ...data
      }
      this.routeVisible = true
    },
    // 停用1||启用2
    changeNodeStatus (flag, node) {
      this.loading = true
      const { id, title, enName, sortNo } = node
      let url = ''
      let params = null
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
      }
      this.$http({
        url,
        method: 'post',
        params
      }).then((res) => {
        this.loading = false
        if (res && res.success) {
          this.$message.success(res.message);
          // 切换状态（启用||停用）
          this.$parent.$refs.nodeTree.dealEditNode(res.data)
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
      this.$alert('将删除所选框架，及其所有子框架和关联指标，是否继续？', '删除', {
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
.action-btns {
  display: flex;
  justify-content: space-between;
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
