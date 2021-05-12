// 新增||编辑 模板
<template>
  <div class="modal frame-modal">
    <el-dialog :title="templateData.title" :visible.sync="visible" width="500px" :show-close="false"
      :modal-append-to-body="false" :destroy-on-close='true' :before-close="close">
      <el-form :model="templateData" ref="frameForm" :rules="rules">
        <el-form-item label="模板名称" label-width="120px" prop="indicator">
          <el-input v-model="templateData.name" style="width: 260px;" placeholder="输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sort">
          <el-input-number size="small" v-model="templateData.sort" controls-position="right" :min="1">
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </div>
      <!-- <el-tree :props="props" :load="loadNode" lazy show-checkbox @check-change="handleCheckChange">
      </el-tree> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "IndexModal",
  props: {
    visible: Boolean,
    templateData: Object
  },
  data () {
    return {
      rules: {
        indicator: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ]
      },
    };
  },
  created () {
  },
  watch: {

  },
  mounted () {
    console.log(this.templateData)
  },
  methods: {
    submitForm () {
      this.$refs.frameForm.validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm () {
      this.$refs.frameForm.resetFields();
    },
    close () {
      this.$emit('close')
    },
  }
};
</script>

<style scoped lang="less">
</style>
