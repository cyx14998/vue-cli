// 新增||编辑 指标
<template>
  <div class="modal frame-modal">
    <el-dialog :title="indicatorData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :modal-append-to-body="false" :destroy-on-close='true' :before-close="close">
      <el-form :model="indicatorData" ref="indicatorForm" :rules="rules">
        <el-form-item label="指标" label-width="120px" prop="title">
          <el-input v-model="indicatorData.title" style="width: 260px;" placeholder="输入指标ID/指标名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sortNo">
          <el-input-number size="small" v-model="indicatorData.sortNo" controls-position="right" :min="1">
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
  name: "IndicatorDialog",
  props: {
    visible: Boolean,
    indicatorData: Object
  },
  data () {
    return {
      rules: {
        title: [
          { required: true, message: '请输入指标ID/指标名称', trigger: 'blur' }
        ]
      },
    };
  },
  created () {
  },
  computed: {
    nodeId () {
      return this.$store.getters.getNodeId
    },
    browsersType () {
      return this.$store.getters.getBrowsersType
    }
  },
  watch: {

  },
  mounted () {
  },
  methods: {
    submitForm () {
      let self = this
      this.$refs.indicatorForm.validate((valid) => {
        if (valid) {
          self.close();
          this.$parent.$parent.changeLoading(true)
          const { title, sortNo, flag, id } = this.templateData
          // 新增
          let url = '/api/databrowser/glTemplate/addGlTemplate'
          let formData = new FormData();
          formData.append('title', title);
          formData.append('sortNo', sortNo);
          formData.append('sectionType', this.browsersType);
          formData.append('parentId', this.nodeId);
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          // 编辑
          if (flag !== 1) {
            url = '/api/databrowser/glTemplate/updateGlTemplate'
            formData.append('id', id);
          } else {
            formData.append('templateFile', this.templateData.templateFile);
          }
          this.$axios.post(url, formData, config).then(function (res) {
            self.$parent.$parent.changeLoading(false)
            if (res.data && res.data.success) {
              self.$message({
                type: 'success',
                message: res.data.message
              })
              self.$nextTick(() => {
                self.$parent.$parent.getData()
              })
            } else {
              self.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch((res) => {
            self.$message({
              type: 'error',
              message: res
            })
            self.$parent.$parent.changeLoading(false)
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
