// 新增||编辑 框架
<template>
  <div class="modal frame-modal">
    <el-dialog :title="frameData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :destroy-on-close='true' :before-close="close">
      <el-form :model="frameData" ref="frameForm" :rules="rules">
        <el-form-item label="是否叶子节点" label-width="120px" prop="isLeaf">
          <el-select v-model="frameData.isLeaf" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="框架中文名称" label-width="120px" prop="frameName">
          <el-input v-model="frameData.frameName"></el-input>
        </el-form-item>
        <el-form-item label="框架英文名称" label-width="120px" prop="frameNameEn">
          <el-input v-model="frameData.frameNameEn"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sortBy">
          <el-input-number size="small" v-model="frameData.sortBy" controls-position="right" :min="1">
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
import { mapState } from 'vuex'
export default {
  name: "IndexModal",
  props: {
    visible: Boolean,
    frameData: Object
  },
  data () {
    return {
      rules: {
        isLeaf: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        frameName: [
          { required: true, message: '请输入框架中文名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
        ],
        enName: [
          { required: false, message: '请输入框架英文名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        sortBy: [
          { required: true, message: '', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
  },
  computed: {
    ...mapState({
      activeName: 'activeName',
      browsersType: 'browsersType',
      nodeId: 'nodeId'
    })
  },
  mounted () {
  },
  methods: {
    submitForm () {
      this.$refs.frameForm.validate((valid) => {
        if (valid) {
          this.close();
          this.$parent.changeLoading(true)
          const { frameName, frameNameEn, sortBy, flag, isLeaf, id } = this.frameData
          let url = ''
          let params = {
            browserType: this.browsersType,
            frameName,
            frameNameEn: frameNameEn || '',
            sortBy,
            isLeaf: +isLeaf,
            parentId: this.nodeId,
          }
          
          // 指标框架
          if (this.activeName === 'indexFrame') {
            // 新增
            url = '/backapi/databrowser/systemIndexFrameBack/addSystemIndexFrame'
            // 编辑
            if (flag !== 1) {
              url = '/backapi/databrowser/systemIndexFrameBack/updateSystemIndexFrame'
              params = {
                ...params,
                // status,
                id
              }
            }
          } else {
            // 范围框架

            // 新增
            url = '/backapi/databrowser/rangeFrameBack/saveRangeFrame'
            // 编辑
            if (flag !== 1) {
              url = '/backapi/databrowser/rangeFrameBack/updateRangeFrame'
              params = {
                ...params,
                // status,
                id
              }
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
