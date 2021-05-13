// 新增||编辑 框架
<template>
  <div class="modal frame-modal">
    <el-dialog :title="frameData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :destroy-on-close='true' :before-close="close">
      <el-form :model="frameData" ref="frameForm" :rules="rules">
        <el-form-item label="框架中文名称" label-width="120px" prop="title">
          <el-input v-model="frameData.title"></el-input>
        </el-form-item>
        <el-form-item label="框架英文名称" label-width="120px" prop="enName">
          <el-input v-model="frameData.enName"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sortNo">
          <el-input-number size="small" v-model="frameData.sortNo" controls-position="right" :min="1">
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
        title: [
          { required: true, message: '请输入框架中文名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
        ],
        enName: [
          { required: false, message: '请输入框架英文名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        sortNo: [
          { required: false, message: '', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
  },
  computed: {
    nodeId () {
      return this.$store.getters.getNodeId
    }
  },
  mounted () {
  },
  methods: {
    submitForm () {
      this.$refs.frameForm.validate((valid) => {
        if (valid) {
          this.close();
          this.$parent.changeLoading(true)
          const { title, enName, sortNo, flag, status, id } = this.frameData
          // 新增
          let url = '/api/databrowser/glTemplate/addFramework'
          let params = {
            title,
            enName,
            sortNo,
            sectionType: 1,
            parentId: this.nodeId,
            status: false
          }
          // 编辑
          if (flag !== 1) {
            url = '/api/databrowser/glTemplate/updateFramework'
            params = {
              ...params,
              status,
              id
            }
          }
          this.$http({
            url,
            method: 'post',
            params
          }).then((res) => {
            this.$parent.changeLoading(false)
            if (res && res.success) {
              this.$message({
                type: 'success',
                message: res.message
              })
              if (res.data) {
                // 新增
                if (flag === 1) {
                  this.$parent.$parent.$refs.nodeTree.dealAddNode(res.data)
                } else {
                  // 编辑
                  this.$parent.$parent.$refs.nodeTree.dealEditNode(res.data)
                }
              }
              this.$nextTick(() => {
                this.$parent.getData()
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }).catch(() => {
            this.$parent.changeLoading(false)
          })
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
