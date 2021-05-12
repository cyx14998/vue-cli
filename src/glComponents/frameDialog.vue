// 新增||编辑 框架
<template>
  <div class="modal frame-modal">
    <el-dialog :title="frameData.title" :visible.sync="visible" width="500px" :show-close="false"
      :destroy-on-close='true' :before-close="close">
      <el-form :model="frameData" ref="frameForm" :rules="rules">
        <el-form-item label="框架中文名称" label-width="120px" prop="cnName">
          <el-input v-model="frameData.cnName"></el-input>
        </el-form-item>
        <el-form-item label="框架英文名称" label-width="120px" prop="enName">
          <el-input v-model="frameData.enName"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sort">
          <el-input-number size="small" v-model="frameData.sort" controls-position="right" :min="1">
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "IndexModal",
  props: {
    visible: Boolean,
    frameData: Object
  },
  data () {
    return {
      rules: {
        cnName: [
          { required: true, message: '请输入框架中文名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
        ],
        enName: [
          { required: false, message: '请输入框架英文名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        sort: [
          { required: false, message: '', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
  },
  computed: {
    activeName () {
      return this.$store.getters.getActiveName
    }
  },
  mounted () {
    console.log(this.frameData)
  },
  methods: {
    submitForm () {
      this.$refs.frameForm.validate((valid) => {
        if (valid) {
          if (this.activeName === 'indexFrame') {
            console.log('新增指标框架')
          } else {
            console.log('新增范围框架')
          }
          alert('submit!');
        } else {
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
