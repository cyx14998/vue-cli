// 范围||指标 框架路径 
<template>
  <div class="indicator modal zb-modal">
    <el-drawer :visible.sync="visible" :with-header="false" size="100%">
      <div class="zb-modal-header">
        <div class="zb-modal-header__title">
          <h3 class="zb-modal-header__text"><span>框架路径：宏观</span></h3>
        </div>
        <div class="zb-modal-header__append">
          <el-button size="small" @click="closeModal">返回框架配置</el-button>
        </div>
      </div>
      <div class="zb-modal-add">
        <el-button v-if="activeName === 'indexFrame'" type="primary" size="small" @click="indicatorModal(1)">新增指标
        </el-button>
        <el-button v-else type="primary" size="small" @click="rangeModal(1)">新增范围</el-button>
      </div>
      <div class="padding20">
        <el-table v-if="activeName === 'indexFrame'" :data="tableData" ref="zb_table" size="small" border
          class="zb-modal-table" :height="zb_tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column property="id" label="指标ID" width="150"></el-table-column>
          <el-table-column property="name" label="指标名称" width="300"></el-table-column>
          <el-table-column property="status" label="状态"></el-table-column>
          <el-table-column property="sort" label="排序"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="indicatorModal(2,scope.row)">编辑</el-button>
              <el-popconfirm class="marginl10 displayi-b" title="是否停用?" v-if="scope.row.nodeStatus != 1"
                :confirm="changeNodeStatus(scope.row)">
                <el-button icon="el-icon-delete" class="delBtn" type="text" slot="reference">停用</el-button>
              </el-popconfirm>
              <el-popconfirm class="marginl10 displayi-b" title="是否启用?" v-else :confirm="changeNodeStatus(scope.row)">
                <el-button type="text" slot="reference">启用</el-button>
              </el-popconfirm>
              <!-- <el-button icon="el-icon-delete" class="delBtn" type="text" v-if="scope.row.nodeStatus != 1"
                @click="changeNodeStatus(scope.row)">停用</el-button>
              <el-button type="text" v-else @click="changeNodeStatus(scope.row)">启用</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="tableData" ref="zb_table" size="small" border class="zb-modal-table"
          :height="zb_tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column property="name" label="范围名称" width="300"></el-table-column>
          <el-table-column property="filter" label="状态参数过滤条件" width="400"></el-table-column>
          <el-table-column property="status" label="状态">
            <template slot-scope="scope">{{ scope.row.status === 1 ? '启用' : '停用' }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="rangeModal(2,scope.row)">编辑</el-button>
              <el-popconfirm class="marginl10 displayi-b" title="是否停用?" v-if="scope.row.nodeStatus === 1"
                :confirm="changeNodeStatus(scope.row)">
                <el-button icon="el-icon-delete" class="delBtn" type="text" slot="reference">停用</el-button>
              </el-popconfirm>
              <el-popconfirm class="marginl10 displayi-b" title="是否启用?" v-else :confirm="changeNodeStatus(scope.row)">
                <el-button type="text" slot="reference">启用</el-button>
              </el-popconfirm>
              <!-- <el-button icon="el-icon-delete" class="delBtn" type="text" v-if="scope.row.nodeStatus != 1"
                @click="changeNodeStatus(scope.row)">停用</el-button>
              <el-button type="text" v-else @click="changeNodeStatus(scope.row)">启用</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="el-row batch-withdraw" ref="zb_botAction">
          <el-col :span="8">
            <el-button type="primary" size="small" :disabled="!multipleSelection.length" @click="mulDel">批量删除
            </el-button>
          </el-col>
          <el-col :span="16" class="align-right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
              :page-sizes="[10, 20, 50, 100]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </el-col>
        </div>
      </div>
      <IndicatorDialog v-if="indicatorDialogVisible" :visible="indicatorDialogVisible" @close="indicatorDialogClose"
        :indicatorData="indicatorData">
      </IndicatorDialog>
      <RangeDialog v-if="rangeDialogVisible" :visible="rangeDialogVisible" @close="rangeDialogClose" :rangeData="rangeData">
      </RangeDialog>
    </el-drawer>
  </div>
</template>

<script>
import IndicatorDialog from './indicatorDialog'
import RangeDialog from './rangeDialog'
export default {
  name: "RoutePage",
  props: {
    visible: Boolean
  },
  components: {
    IndicatorDialog,
    RangeDialog
  },
  data () {
    return {
      tableData: [{
        id: '110100000000',
        name: '基本资料',
        route: '指标框架|第二层',
        isLeaf: false,
        status: 1,
        sort: 1
      }],
      multipleSelection: [],
      page: 1,
      zb_tableHeight: 0,
      rangeDialogVisible: false, // 范围弹窗visible
      rangeData: {}, // 范围弹窗数据
      indicatorDialogVisible: false, // 指标弹窗visible
      indicatorData: {}, // 指标弹窗数据
    };
  },
  created () {
  },
  computed: {
    activeName () {
      return this.$store.getters.getActiveName
    }
  },
  watch: {

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
      let data = []
      for (let i = 0; i < 40; i++) {
        let d = Object.assign({}, this.tableData[0])
        d.id = i
        data.push(d)
      }
      this.tableData = data
    },
    closeModal () {
      this.$emit('close')
    },
    // 范围 新增||编辑 弹窗
    rangeModal (flag, data) {
      this.rangeData = {
        ...data,
        flag,
        title: flag === 1 ? '新增范围' : '编辑范围'
      }
      this.rangeDialogVisible = true
    },
    rangeDialogClose () {
      this.rangeDialogVisible = false
    },
    // 指标 新增||编辑 弹窗
    indicatorModal (flag, data) {
      this.indicatorData = {
        ...data,
        flag,
        title: flag === 1 ? '新增指标' : '编辑指标'
      }
      this.indicatorDialogVisible = true
    },
    indicatorDialogClose () {
      this.indicatorDialogVisible = false
    },

    changeNodeStatus () {

    },
    handleSizeChange () { },
    handleCurrentChange () { },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    mulDel () {
      this.$alert('是否删除?', '删除', {
        // showCancelButton: true,
        confirmButtonText: '确定',
        // cancelButtonText: '取消',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          });
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
