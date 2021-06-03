// 新增||编辑 模板
<template>
  <div class="modal frame-modal">
    <el-dialog :title="templateData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body="false"
      :destroy-on-close='true' :before-close="close">
      <el-form :model="templateData" ref="frameForm" :rules="rules">
        <el-form-item label="模板名称" label-width="120px" prop="title">
          <el-input v-model="templateData.title" style="width: 260px;" placeholder="输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sortNo">
          <el-input-number size="small" v-model="templateData.sortNo" controls-position="right" :min="1" :max="99">
          </el-input-number>
        </el-form-item>
        <el-form-item class="uploadCon" label-width="120px" prop="templateFile">
          <el-button size="small" type="primary" @click="handleChange">上传模板文件
            <!-- <i v-if="templateData.templateFile !== null" class="el-icon-check"></i> -->
          </el-button>
          <img class="uploadImg" v-if="templateData.templateFile !== null || templateData.flag === 2" src="../static/img/icon.png" alt="">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </div>
      <input style="width:0px;height:0px;" id="exportTemplate" type="file" :accept="accept" ref="exportBtn"
        @change="exportFileChange" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import baseUrl from '@/utils/env'
export default {
  name: "IndexModal",
  props: {
    visible: Boolean,
    templateData: Object
  },
  data () {
    return {
      accept: '.fdbt',
      rules: {
        title: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '请填写排序', trigger: 'blur' }
        ],
        templateFile: [
          { required: true, message: '请上传模板文件', trigger: 'change' }
        ],
      },
    };
  },
  created () {
  },
  computed: {
    ...mapState({
      activeName: 'activeName',
      browserType: 'browserType',
      nodeId: 'nodeId',
    })
  },
  watch: {

  },
  mounted () {
    const { flag } = this.templateData
    if (flag === 1) {
      this.rules.templateFile[0].required = true
    } else {
      this.rules.templateFile[0].required = false
    }
    if (this.browserType == '0') {
      this.accept = '.mtext'
    }
    // console.log(this.templateData)
  },
  methods: {
    handleChange () {
      let btn = this.$refs.exportBtn;
      btn.value = "";
      btn.click();
    },
    exportFileChange (e) {
      try {
        this.templateData.templateFile = e.target.files[0];// 通过DOM取文件数据
        this.$refs.frameForm.clearValidate('templateFile')
      } catch (e) {
        console.error(e)
      }
    },
    submitForm () {
      let self = this
      this.$refs.frameForm.validate((valid) => {
        if (valid) {
          self.close();
          self.$parent.$parent.changeLoading(true)
          const { title, sortNo, flag, id, templateFile } = self.templateData
          // 新增
          let url = baseUrl + '/backapi/databrowser/glTemplate/addGlTemplate'
          let formData = new FormData();
          formData.append('title', title);
          formData.append('sortNo', sortNo);
          formData.append('sectionType', self.browserType);
          formData.append('parentId', self.nodeId);
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          // 编辑
          if (flag !== 1) {
            url = baseUrl + '/backapi/databrowser/glTemplate/updateGlTemplate'
            formData.append('id', id);
          }
          if (templateFile) {
            formData.append('templateFile', templateFile);
          }
          self.$axios.post(url, formData, config).then(function (res) {
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
.uploadCon {
  .uploadImg {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 5px;
    vertical-align: middle;
  }
}
</style>
