// 头部搜索
<template>
  <div class="right-top-part">
    <div class="search-part marginb-10">
      <el-form :inline="true" ref="formInline" :model="formInline" class="form-inline">
        <el-form-item prop="frameName">
          <el-input v-model="formInline.frameName" placeholder="框架名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isDelete">
          <el-select class="width-100" v-model="formInline.isDelete" placeholder="状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexFrame",
  props: {
  },
  data () {
    return {
      formInline: {
        frameName: '',
        isDelete: '-1'
      },
    };
  },
  created () {

  },
  watch: {

  },
  mounted () {
  },
  methods: {
    onSubmit () {
      this.$store.dispatch("setFilterParams", { ...this.formInline })
      this.$store.dispatch('setNodeId', '-1')
      this.$parent.$refs.tablePage.getData(1)
    },
    resetForm () {
      this.$refs['formInline'].resetFields();
    },
  }
};
</script>

<style scoped lang="less">
.search-part {
  border-bottom: 1px dashed #dcdfe6;
  .el-form-item {
    margin-bottom: 10px;
  }
}

.action-btns {
  display: flex;
  justify-content: space-between;
}
</style>
