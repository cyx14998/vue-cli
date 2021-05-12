// 右侧 table
<template>
  <div class="indexTable" ref="indexRef">
    <div class="action-btns marginb-10">
      <div class="btn-flex">
        <el-button size="small">框架模板下载</el-button>
        <el-button type="primary" size="small">框架导入</el-button>
      </div>
      <div>
        <el-button type="primary" size="small" @click="editNode(1,{})">新增框架</el-button>
      </div>
    </div>
    <el-table border size="small" ref="multipleTable" :data="tableData" tooltip-effect="dark"
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
      <el-table-column prop="sort" label="排序" width="50">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button class="marinl5" type="text" @click="editNode(2,scope.row)">编辑</el-button>
          <el-button class="marinl5" type="text" v-if="activeName === 'indexFrame'"
            @click="openIndexFrameModal(scope.row)">指标
          </el-button>
          <el-button type="text" v-else @click="openIndexFrameModal(scope.row)">范围</el-button>
          <el-popconfirm class="marinl5 displayi-b" title="是否停用?" v-if="scope.row.nodeStatus != 1"
            :confirm="changeNodeStatus(scope.row)">
            <el-button icon="el-icon-delete" class="delBtn" type="text" slot="reference">停用</el-button>
          </el-popconfirm>
          <el-popconfirm class="marinl5 displayi-b" title="是否启用?" v-else :confirm="changeNodeStatus(scope.row)">
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 50, 100]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </el-col>
    </div>
    <RoutePage v-if="routePageVisible" :visible="routePageVisible" @close="routePageClose" />
    <FrameModal v-if="frameModalVisible" :visible="frameModalVisible" @close="frameModalClose" :frameData="frameData" />
  </div>
</template>

<script>
import RoutePage from '../components/routePage'
import FrameModal from '../components/frameModal'
export default {
  name: "TablePage",
  props: {
    tableHeight: Number
  },
  components: {
    RoutePage,
    FrameModal
  },
  data () {
    return {
      tableData: [{
        id: 110100000000,
        cnName: '基本资料',
        enName: 'base data',
        route: '指标框架|第二层',
        isLeaf: 1,
        status: 1,
        sort: 1
      }],
      multipleSelection: [],
      page: 1,
      routePageVisible: false, // 指标||范围 drawer
      frameModalVisible: false, // 新增||编辑 框架dialog
      frameData: '', // 新增||编辑 传进去的数据
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
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.multipleSelection = []
      const filterParams = this.$store.getters.getFilterParams
      console.log(filterParams)
      let data = []
      for (let i = 0; i < 400; i++) {
        let d = Object.assign({}, this.tableData[0])
        d.id = i
        data.push(d)
      }
      this.tableData = data
    },
    routePageClose () {
      this.routePageVisible = false
    },
    frameModalClose () {
      this.frameModalVisible = false
    },
    editNode (flag, data) {
      this.frameData = {
        ...data,
        isLeaf: flag === 2 ? '' + data.isLeaf : '',
        flag,
        sort: flag === 2 ? '' + data.sort : 1,
        title: flag === 1 ? '新增框架' : '编辑框架'
      }
      this.frameModalVisible = true
    },
    // 打开指标页面
    openIndexFrameModal (data) {
      console.log(data)
      this.routePageVisible = true
    },
    handleSizeChange () { },
    changeNodeStatus () { },
    handleCurrentChange () { },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
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
