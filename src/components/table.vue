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
      <el-table-column prop="frameName" label="框架中文名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="frameNameEn" label="框架英文名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="systemIndexNamePath" label="框架路径" v-if="activeName === 'indexFrame'">
      </el-table-column>
      <el-table-column prop="rangeFrameNamePath" label="框架路径" v-else>
      </el-table-column>
      <el-table-column prop="isLeaf" label="是否叶子节点" width="106">
        <template slot-scope="scope">{{ scope.row.isLeaf ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="50">
        <template slot-scope="scope">{{ scope.row.isDelete !== 1 ? '启用' : '停用' }}</template>
      </el-table-column>
      <el-table-column prop="sortBy" label="排序" width="50">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="editNode(2,scope.row)">编辑</el-button>
          <el-button class="marginl10" type="text" v-if="activeName === 'indexFrame'" @click="openRoute(scope.row)">指标
          </el-button>
          <el-button type="text" v-else @click="openRoute(scope.row)">范围</el-button>
          <el-button icon="el-icon-delete" class="delBtn" type="text" v-if="scope.row.isDelete !== 1"
            @click="changeNodeStatus(1,scope.row)">停用</el-button>
          <el-button type="text" v-else @click="changeNodeStatus(0,scope.row)">启用</el-button>
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

import { mapState } from 'vuex'
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
      downLoadUrl: '',
      tableData: [],
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
    this.getData()
  },
  computed: {
    ...mapState({
      activeName: 'activeName',
      browserType: 'browserType',
      nodeId: 'nodeId',
      filterParams: 'filterParams',
      isLeaf: 'isLeaf'
    })
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    getData (flag) {
      this.multipleSelection = []
      const { pageNo, pageSize } = this.pageParams
      const { frameName, isDelete } = this.filterParams
      this.loading = true
      let url = ''
      let downLoadUrl = ''
      let params = {}
      if (this.activeName === 'indexFrame') {
        url = `/backapi/databrowser/systemIndexFrameBack/getSystemFrameListByNameLikeAndStatus?pageNo=${pageNo}&pageSize=${pageSize}`
        params = {
          browserType: this.browserType,
          parentId: this.nodeId,
          pageNo,
          pageSize,
          frameName,
          isDelete
        }
        downLoadUrl = baseUrl + '/backapi/databrowser/systemIndexFrameBack/download'
      } else {
        url = `/backapi/databrowser/rangeFrameBack/getRangeFrameListByNameLikeAndStatus?pageNo=${pageNo}&pageSize=${pageSize}`
        params = {
          browserType: this.browserType,
          parentId: this.nodeId,
          pageNo,
          pageSize,
          frameName,
          isDelete
        }
        downLoadUrl = baseUrl + '/backapi/databrowser/rangeFrameBack/download'
      }
      this.downLoadUrl = downLoadUrl
      if (params.isDelete === '-1') {
        delete params.isDelete
      }
      // 重置pageNo
      if (flag === 1) {
        params.pageNo = 1
        this.pageParams = {
          ...this.pageParams,
          pageNo: 1,
        }
      }
      // 重置parentId
      if (params.parentId === '') {
        delete params.parentId
      }
      this.$http({
        url,
        method: 'post',
        params
      }).then((res) => {
        this.loading = false
        if (res && res.success) {
          const { total, records } = res.data
          this.tableData = records
          this.pageParams = {
            ...this.pageParams,
            total,
          }
        } else {
          this.$message.error(res.message || '获取table数据出错!')
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
        let url = ''
        if (this.activeName === 'indexFrame') {
          url = baseUrl + `/backapi/databrowser/systemIndexFrameBack/upload?browserType=${this.browserType}&parentId=${this.nodeId}`
        } else {
          url = baseUrl + `/backapi/databrowser/rangeFrameBack/upload?browserType=${this.browserType}&parentId=${this.nodeId}`
        }
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
      if (flag === 1 && this.isLeaf === 1) {
        this.$message({
          type: 'info',
          message: '叶子节点无法新增框架'
        })
        return
      }
      this.frameData = {
        ...data,
        isLeaf: flag === 2 ? '' + data.isLeaf : '',
        flag,
        sortBy: flag === 2 ? '' + data.sortBy : 1,
        headTitle: flag === 1 ? '新增框架' : '编辑框架'
      }
      this.frameDialogVisible = true
    },
    // 打开指标||范围页面
    openRoute (data) {
      if (data.isLeaf !== 1) {
        if (this.activeName === 'indexFrame') {
          this.$message({
            type: 'info',
            message: '非叶子节点无法关联指标'
          })
        } else {
          this.$message({
            type: 'info',
            message: '非叶子节点无法关联范围'
          })
        }
        return
      }
      let pRoute = data.systemIndexNamePath || data.rangeFrameNamePath
      let route = pRoute ? pRoute + '|' + data.frameName : data.frameName
      this.routeData = {
        ...data,
        route
      }
      this.routeVisible = true
    },
    // 停用1||启用0
    changeNodeStatus (flag, node) {
      this.loading = true
      const { id, frameName, frameNameEn, sortBy, isLeaf } = node
      let url = ''
      if (this.activeName === 'indexFrame') {
        url = '/backapi/databrowser/systemIndexFrameBack/updateSystemIndexFrame'
      } else {
        url = '/backapi/databrowser/rangeFrameBack/updateRangeFrame'
      }
      let params = {
        id,
        frameName,
        frameNameEn,
        sortBy,
        isLeaf,
        isDelete: flag
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
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message.error('获取框架table接口超时或出错！')
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
            let url
            if (this.activeName === "indexFrame") {
              url = '/backapi/databrowser/systemIndexFrameBack/delSystemIndexFrameByIds'
            } else {
              url = "/backapi/databrowser/rangeFrameBack/delRangeFrameByIds"
            }
            this.$http({
              url,
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
                this.$message.error(res.message)
              }
            }).catch(() => {
              this.$message.error('批量删除接口超时或出错!')
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
