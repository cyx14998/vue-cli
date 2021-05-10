<template>
  <div class="right-top-part">
    <div class="search-part marginb-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="框架名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select class="width-100" v-model="formInline.region" placeholder="状态">
            <el-option label="全部" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-btns marginb-10">
      <div class="btn-flex">
        <el-button size="small">框架模板下载</el-button>
        <el-button type="primary" size="small">框架导入</el-button>
      </div>
      <div>
        <el-button type="primary" size="small">新增框架</el-button>
      </div>
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
        user: '',
        region: '0'
      }
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
      console.log('submit!');
    }
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
