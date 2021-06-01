// 新增||编辑 指标
<template>
  <div class="modal frame-modal">
    <el-dialog :title="indicatorData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :modal-append-to-body="false" :destroy-on-close='true' :before-close="close">
      <el-form :model="indicatorData" ref="indicatorForm" :rules="rules" v-loading="indicatorLoading">
        <el-form-item label="指标" label-width="120px" prop="indexId">
          <!-- <el-input v-model="indicatorData.title" style="width: 260px;" placeholder="输入指标ID/指标名称"></el-input> -->
          <el-select v-model="indicatorData.indexId" filterable placeholder="输入指标ID/指标名称" :filter-method="dataFilter"
            @visible-change="changeSel($event)">
            <el-option v-for="item in dataArr" :key="item.indexId" :label="item.indexName" :value="item.indexId">
              <span>{{ item.indexId }}-{{ item.indexName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sortBy">
          <el-input-number size="small" v-model="indicatorData.sortBy" controls-position="right" :min="1">
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
  name: "IndicatorDialog",
  props: {
    visible: Boolean,
    indicatorData: Object
  },
  data () {
    return {
      rules: {
        indexId: [
          { required: true, message: '请输入指标ID/指标名称', trigger: 'blur' }
        ]
      },
      dataArr: [],
      dataArrCopy: [], // 筛选需要
      indicatorLoading: false,
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
  watch: {

  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.indicatorLoading = true
      this.$http({
        url: '/backapi/databrowser/systemIndexBack/getAddSystemIndexName',
        method: 'get',
        params: {
          browserType: this.browserType,
        }
      }).then((res) => {
        this.indicatorLoading = false
        if (res && res.success) {
          this.dataArrCopy = this.dataArr = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }).catch(() => {
        this.indicatorLoading = false
        this.$message({
          type: 'error',
          message: '指标查询接口超时或出错!'
        })
      })
    },
    dataFilter (val) {
      if (val) {
        this.dataArr = this.dataArrCopy.filter((item) => {
          if (!!~item.indexId.indexOf(val) || !!~item.indexName.indexOf(val)) {
            return true
          }
        })
      } else {
        this.dataArr = this.dataArrCopy
      }
    },
    changeSel (callback) {
      if (callback) {
        this.dataArr = this.dataArrCopy
      }
    },
    submitForm () {
      let self = this
      this.$refs.indicatorForm.validate((valid) => {
        if (valid) {
          const { id, frameId, indexId, sortBy, flag } = this.indicatorData
          self.close();
          self.$parent.$parent.changeLoading(true)
          let len = this.dataArrCopy.length
          let indexName
          for (let i = 0; i < len; i++) {
            let item = this.dataArrCopy[i]
            if (item.indexId === indexId) {
              indexName = item.indexName
            }
          }
          let url = ''
          let params = {}
          if (flag === 1) {
            url = '/backapi/databrowser/systemIndexFrameRelationBack/addSystemIndexRelation'
            params = {
              frameId,
              indexId,
              indexName,
              sortBy,
            }
          } else if (flag === 2) { // 编辑
            url = '/backapi/databrowser/systemIndexFrameRelationBack/updateSystemIndexRelation'
            params = {
              id,
              indexId,
              indexName,
              sortBy,
            }
          }
          self.$http({
            url,
            method: 'post',
            params
          }).then((res) => {
            self.$parent.$parent.changeLoading(false)
            if (res && res.success) {
              self.$message({
                type: 'success',
                message: res.message
              })
              self.$parent.$parent.getData()
            } else {
              self.$message({
                type: 'error',
                message: res.message
              })
            }
          }).catch((res) => {
            self.$parent.$parent.changeLoading(false)
            self.$message({
              type: 'error',
              message: res
            })
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
