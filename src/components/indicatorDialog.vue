// 新增||编辑 指标
<template>
  <div class="modal frame-modal">
    <el-dialog :title="indicatorData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :modal-append-to-body="false" :destroy-on-close='true' :before-close="close">
      <el-form :model="indicatorData" ref="indicatorForm" :rules="rules">
        <el-form-item label="指标" label-width="120px" prop="title">
          <!-- <el-input v-model="indicatorData.title" style="width: 260px;" placeholder="输入指标ID/指标名称"></el-input> -->
          <el-select v-model="indicatorData.title" filterable placeholder="输入指标ID/指标名称" :filter-method="dataFilter"
            @change="changeSel">
            <el-option v-for="item in dataArr" :key="item.id" :label="item.frameName" :value="item.id">
              <span>{{ item.id }}-{{ item.frameName }}</span>
            </el-option>
          </el-select>
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
      dataArr: [],
      dataArrCopy: [], // 筛选需要
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
    this.getData()
  },
  methods: {
    getData () {
      this.$http({
        url: '/backapi/databrowser/systemIndexFrameBack/getSystemFrameListByNameLikeAndStatus',
        method: 'post',
        params: {
          browserType: this.browsersType || 1,
          // frameName: 'ces',
          // isDelete: 1,
        }
      }).then((res) => {
        if (res && res.success) {
          this.dataArrCopy = this.dataArr = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    dataFilter (val) {
      if (val) {
        this.dataArr = this.dataArrCopy.filter((item) => {
          if (!!~item.id.indexOf(val) || !!~item.frameName.indexOf(val)) {
            return true
          }
        })
      } else {
        this.dataArr = this.dataArrCopy
      }
    },
    changeSel () {
      this.dataArr = this.dataArrCopy
    },
    submitForm () {
      let self = this
      this.$refs.indicatorForm.validate((valid) => {
        if (valid) {
          self.close();
          this.$parent.$parent.changeLoading(true)
          const { title, sortNo, flag, id } = this.indicatorData
          let params = {
            title,
            sortNo
          }
          if (flag === 2) {
            params.id = id
          }
          this.$http({
            url: '/backapi/databrowser/glTemplate/batchDeleteGlTemplate',
            method: 'post',
            params
          }).then(function (res) {
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
