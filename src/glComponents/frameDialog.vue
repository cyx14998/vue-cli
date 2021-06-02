// 新增||编辑 框架
<template>
  <div class="modal frame-modal">
    <el-dialog :title="frameData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close='true' :before-close="close">
      <el-form :model="frameData" ref="frameForm" :rules="rules">
        <el-form-item label="框架中文名称" label-width="120px" prop="title">
          <el-input v-model="frameData.title"></el-input>
        </el-form-item>
        <el-form-item label="框架英文名称" label-width="120px" prop="enName">
          <el-input v-model="frameData.enName"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sortNo">
          <el-input-number size="small" v-model="frameData.sortNo" controls-position="right" :min="1" :max="99">
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
  name: "FrameDialog",
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
    ...mapState({
      browserType: 'browserType',
      nodeId: 'nodeId'
    })
  },
  mounted () {
  },
  methods: {
    submitForm () {
      let self = this
      this.$refs.frameForm.validate((valid) => {
        if (valid) {
          self.close();
          self.$parent.changeLoading(true)
          const { title, enName, sortNo, flag, status, id } = self.frameData
          // 新增
          let url = '/backapi/databrowser/glTemplate/addFramework'
          let params = {
            title,
            enName,
            sortNo,
            sectionType: self.browserType,
            parentId: self.nodeId,
            status: false
          }
          // 编辑
          if (flag !== 1) {
            url = '/backapi/databrowser/glTemplate/updateFramework'
            params = {
              ...params,
              status,
              id
            }
          }
          self.$http({
            url,
            method: 'post',
            params
          }).then((res) => {
            self.$parent.changeLoading(false)
            if (res && res.success) {
              self.$message({
                type: 'success',
                message: res.message
              })
              if (res.data) {
                // 新增
                if (flag === 1) {
                  self.$parent.$parent.$refs.nodeTree.dealAddNode(res.data)
                } else {
                  // 编辑
                  self.$parent.$parent.$refs.nodeTree.dealEditNode(res.data)
                }
              }
              self.$nextTick(() => {
                self.$parent.getData()
              })
            } else {
              self.$message({
                type: 'error',
                message: res.message
              })
            }
          }).catch(() => {
            self.$parent.changeLoading(false)
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
