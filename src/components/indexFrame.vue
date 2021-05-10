<template>
  <div class="indexTable" ref="indexRef">
    <el-table border size="small" ref="multipleTable" :data="tableData" tooltip-effect="dark"
      :style="{width: '100%', height: tableHeight + 'px'}" :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="框架ID" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="框架中文名称" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="框架英文名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="框架路径" width="300">
      </el-table-column>
      <el-table-column prop="address" label="是否叶子节点">
      </el-table-column>
      <el-table-column prop="address" label="状态">
      </el-table-column>
      <el-table-column prop="address" label="排序">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="editNode(scope.row)">编辑</el-button>
          <el-button type="text" @click="openModal(scope.row.nodeId)">指标</el-button>
          <el-button icon="el-icon-delete" class="delBtn" type="text" v-if="scope.row.nodeStatus != 1"
            @click="changeNodeStatus(scope.row)">停用</el-button>
          <el-button type="text" v-else @click="changeNodeStatus(scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="el-row batch-withdraw" ref="botAction">
      <el-col :span="8">
        <el-button type="primary" size="small">批量删除</el-button>
      </el-col>
      <el-col :span="16">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 50, 100]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexFrame",
  props: {
    tableHeight: Number
  },
  data () {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      page: 1
    };
  },
  created () {

  },
  watch: {

  },
  mounted () {
    this.tableData = this.tableData.concat(this.tableData).concat(this.tableData).concat(this.tableData).concat(this.tableData)
  },
  methods: {
    editNode () { },
    openModal () { },
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
    }
  }
};
</script>

<style scoped lang="less">
.batch-withdraw {
  margin-top: 10px;
}
.delBtn.el-button {
  color: red;
  & + span {
    margin-left: 0;
  }
}
</style>
