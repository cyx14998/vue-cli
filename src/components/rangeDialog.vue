// 新增||编辑 范围
<template>
  <div class="modal frame-modal">
    <el-dialog :title="rangeData.headTitle" :visible.sync="visible" width="500px" destroy-on-close :show-close="false"
      :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body="false" :before-close="close">
      <el-form :model="rangeData" ref="frameForm" :rules="rules" hide-required-asterisk v-loading="rangeLoading">
        <el-form-item label-width="140px" prop="rangeVal" class="treeOuter">
          <span slot="label"><span class="red">*</span> 范围</span>
          <el-select v-model="rangeVal" multiple placeholder="请选择" @change="changeData" style="width: 100%;"
            :disabled="rangeLoading">
            <el-option style="height: auto;max-height: 600px;overflow: auto;" :value="SelectedArray"
              v-if="dataList.length" disabled>
              <el-tree :props="defaultProps" node-key="id" :loading="rangeLoading" ref="rangeTree" :data="dataList"
                show-checkbox @check-change="handleCheckChange">
              </el-tree>
            </el-option>
            <el-option v-else disabled value="">
              暂无数据
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="140px" prop="rangeConditions">
          <span slot="label">成分参数过滤条件</span>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="rangeData.rangeConditions">
          </el-input>
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
/*eslint-disable */
import { mapState } from 'vuex'

export default {
  name: "IndexModal",
  props: {
    visible: Boolean,
    rangeData: Object
  },
  data () {
    return {
      rules: {
        rangeVal: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        rangeConditions: [
          { required: false, message: '请输入成分过滤条件', trigger: 'blur' },
        ],
      },
      dataMapList: [], // 遍历用
      SelectedArray: [], // 选中的数组
      dataList: [],
      rangeVal: [], // select绑定的值
      // 对应的字段
      defaultProps: {
        children: 'childList',
        label: 'name',
      },
      rangeLoading: false,
      saveData: '',
      defaultRange: [],
    };
  },
  created () {
    this.getRangeOptionFrameByBrowserType()
  },
  computed: {
    ...mapState({
      activeName: 'activeName',
      browserType: 'browserType',
      nodeId: 'nodeId',
      route: 'route'
    })
  },
  watch: {

  },
  mounted () {
  },
  methods: {
    getRangeOptionFrameByBrowserType () {
      const { flag, rangeOption } = this.rangeData
      this.rangeLoading = true
      this.$http({
        url: '/backapi/databrowser/rangeBack/getRangeOptionTreeByBrowserType',
        method: 'get',
        params: {
          browserType: this.browserType,
        }
      }).then((res) => {
        this.rangeLoading = false
        if (res && res.success) {
          // this.dataList = []
          this.dataList = this.dealData(res.data, 0, '')
          // 编辑时  需要回显范围数据
          if (flag === 2) {
            this.$nextTick(() => {
              let nowRO = JSON.parse(rangeOption)
              nowRO = '' + nowRO.exchange + '' + nowRO.option
              this.defaultRange = [nowRO]
              this.$refs.rangeTree.setCheckedKeys([nowRO], true)
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取范围项框架树查询接口超时或出错!'
        })
        this.rangeLoading = false
      })
    },
    // 循环处理树状结构数据
    dealData (data, level, parentName) {
      const { flag } = this.rangeData
      if (!data || !data.length) {
        return []
      }
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        item.name = item.rangeOptionFrameName || item.rangeOptionTreeName
        item.id = (parentName || item.rangeOptionFrameName) + '' + item.rangeOptionTreeCode
        item.level = level
        if (item.childList && item.childList.length) {
          item.has_children = true
          item.isLeaf = false
          if (flag === 2) {
            item.disabled = true
          }
          this.dealData(item.childList, ++level, item.name)
        } else {
          item.parentName = parentName
          item.has_children = false
          item.isLeaf = true
        }
      }
      return data
    },
    changeData (e) {
      const setkey = []
      for (let index = 0; index < this.dataMapList.length; index++) {
        for (let index1 = 0; index1 < e.length; index1++) {
          if (this.dataMapList[index].name === e[index1]) {
            setkey.push(this.dataMapList[index].id)
          }
        }
      }
      this.setkey = setkey
      // 重新 设置tree
      this.$nextTick(() => {
        this.$refs.rangeTree.setCheckedKeys(setkey, true)
      })
    },
    // 点击树形图复选框触发 
    handleCheckChange (data, checked) {
      const { flag } = this.rangeData
      let checkNodes = []
      if (flag === 2) {
        // this.$refs.rangeTree.setCheckedKeys([], true)
        if (checked) {
          checkNodes = [data]
          this.$refs.rangeTree.setCheckedKeys([data.id], true)
        }
      }
      // checkNodes = this.$refs.rangeTree.getCheckedNodes(true)
      // if (flag === 2 && checkNodes.length > 1) {
      //   this.$message({
      //     type: 'info',
      //     message: '编辑时只能选一个范围!'
      //   })
      //   this.$refs.rangeTree.setCheckedKeys(this.defaultRange, true)
      //   return
      // }
      //点击了复选框 使用this.$refs.rangeTree.getCheckedNodes获取当前选中的节点
      checkNodes = this.$refs.rangeTree.getCheckedNodes()
      this.dataMapList = checkNodes
      const labelArr = []
      const valueArr = []
      const saveData = []
      checkNodes.forEach((element) => {
        if (element.isLeaf) {
          labelArr.push(element.name)
          valueArr.push(element.id)
          saveData.push({
            parentName: element.parentName,
            rangeName: element.name,
            rangeOption: element.rangeOptionTreeCode,
          })
        }
      })
      this.rangeVal = labelArr // select显示的数据
      this.SelectedArray = valueArr
      this.defaultRange = valueArr
      this.saveData = saveData// 我要发送给后端的数据
      // console.log(this.rangeVal, this.SelectedArray)
      // console.log('点击树形图获取当前选中的节点', checkNodes)
      if (labelArr.length === 0) {
        this.rules.rangeVal[0].required = true
      } else {
        this.rules.rangeVal[0].required = false
      }
    },
    submitForm () {
      this.$refs.frameForm.validate((valid) => {
        if (valid) {
          this.close();
          const { frameId, sortBy = 1, rangeConditions, isDelete, rangeId, flag } = this.rangeData
          let saveData = []
          this.saveData.map((item) => {
            saveData.push({
              browserType: this.browserType,
              parentId: frameId,
              rangeConditions,
              rangeName: item.rangeName,
              rangeOption: JSON.stringify({
                exchange: item.parentName,
                option: item.rangeOption
              }),
              sortBy
            })
          })
          let url
          let params
          if (flag === 1) {
            url = '/backapi/databrowser/rangeBack/saveRange'
            params = JSON.stringify(saveData)
          } else {
            if (this.rangeVal.length > 1 || this.SelectedArray.length > 1) {
              this.$message({
                type: 'info',
                message: '编辑时只能选一个范围!'
              })
              return
            }
            url = '/backapi/databrowser/rangeBack/updateRange'
            params = {
              browserType: this.browserType,
              id: rangeId,
              isDelete,
              rangeConditions,
              rangeName: this.rangeVal[0],
              rangeOption: JSON.stringify({
                exchange: this.saveData[0].parentName,
                option: this.saveData[0].rangeOption
              }),
              sortBy
            }
          }
          this.$parent.$parent.changeLoading(true)
          this.$http({
            url,
            method: 'post',
            params
          }).then((res) => {
            this.$parent.$parent.changeLoading(false)
            if (res && res.success) {
              this.$message({
                type: 'success',
                message: res.message
              });
              this.$parent.$parent.getData()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
          }).catch(() => {
            this.$parent.$parent.changeLoading(false)
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
.treeOuter {
  position: relative;
}
.red {
  color: #f56c6c;
}
.treeDiv {
  border: 1px solid #d3dce6;
  position: absolute;
  z-index: 9999;
  width: 100%;
  max-height: 600px;
  overflow: auto;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #fff;
}
.el-select-dropdown__list .el-select-dropdown__item {
  overflow: hidden !important;
}
</style>
