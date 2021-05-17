// 新增||编辑 范围
<template>
  <div class="modal frame-modal">
    <el-dialog :title="rangeData.headTitle" :visible.sync="visible" width="500px" :show-close="false"
      :modal-append-to-body="false" :destroy-on-close='true' :before-close="close">
      <el-form :model="rangeData" ref="frameForm" :rules="rules">
        <el-form-item label="范围" label-width="130px" prop="range" class="treeOuter">
          <!-- <el-select v-model="rangeData.range" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select> -->
          <el-select v-model="rangeVal" multiple placeholder="请选择" @change="changeData" style="width: 100%;">
            <el-option style="height: auto;max-height: 600px;overflow: auto;" :value="SelectedArray">
              <el-tree :props="defaultProps" node-key="id" ref="rangeTree" :data="dataList" show-checkbox
                @check-change="handleCheckChange">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成分参数过滤条件" label-width="130px" prop="filter">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="rangeData.filter"></el-input>
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
const data = [
  {
    id: 1,
    name: '总公司',
    parent_id: null,
    parent_name: null,
    has_children: true,
    children: [
      {
        id: 2,
        name: '1xxxx部门',
        parent_id: 1,
        parent_name: '总公司',
        has_children: true,
        children: [
          {
            id: 12,
            name: 'x1x项目',
            parent_id: 1,
            parent_name: '1xxxx部门',
            has_children: false,
            children: []
          },
          {
            id: 13,
            name: 'x22222x项目',
            parent_id: 2,
            parent_name: '1xxxx部门',
            has_children: true,
            children: [
              {
                id: 19,
                name: 'xxx',
                parent_id: 13,
                parent_name: 'x22222x项目',
                has_children: false,
                children: []
              }
            ]
          }

        ]
      },
      {
        id: 15,
        name: '管理办公室',
        parent_id: 1,
        parent_name: '总公司',
        has_children: false,
        children: []
      },
      {
        id: 16,
        name: '技术中心',
        parent_id: 1,
        parent_name: '总公司',
        has_children: false,
        children: []
      }
    ]
  }
] // tree数据
export default {
  name: "IndexModal",
  props: {
    visible: Boolean,
    rangeData: Object
  },
  data () {
    return {
      rules: {
        isLeaf: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
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
      },
      setkey: [1], // 默认展开节点
      dateList: [], // 遍历用
      SelectedArray: [12, 13], // 选中的数组
      dataList: data,
      rangeVal: [], // select绑定的值
      // 对应的字段
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      props: {
        label: 'name',
        children: 'zones'
      },
    };
  },
  created () {
  },
  watch: {

  },
  mounted () {
    console.log(this.rangeData)
  },
  methods: {
    changeData (e) {
      //   console.log('选中改变的值', e, this.dateList)
      const setkey = []
      for (let index = 0; index < this.dateList.length; index++) {
        for (let index1 = 0; index1 < e.length; index1++) {
          if (this.dateList[index].name === e[index1]) {
            setkey.push(this.dateList[index].id)
          }
        }
      }
    //   console.log(setkey)
      this.setkey = setkey
      // 重新 设置tree
      this.$refs.rangeTree.setCheckedKeys(setkey)
    },
    // 点击树形图复选框触发 
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      //   点击了复选框 使用this.$refs.rangeTree.getCheckedNodes获取当前选中的节点
      const res = this.$refs.rangeTree.getCheckedNodes(false, true) // 这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
    //   console.log('点击树形图获取当前选中的节点', res)
      this.dateList = res
      const labelArr = []
      const valueArr = []
      res.forEach((element) => {
        if (!element.has_children) {
          labelArr.push(element.name)
          valueArr.push(element.id)
        }
      })
      this.rangeVal = labelArr // select显示的数据
      this.SelectedArray = valueArr // 我要发送给后端的数据
      console.log(this.rangeVal, this.SelectedArray)
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }]);
      }
      if (node.level > 3) return resolve([]);

      var hasChild;
      if (node.data.name === 'region1') {
        hasChild = true;
      } else if (node.data.name === 'region2') {
        hasChild = false;
      } else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    },
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
.treeOuter {
  position: relative;
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
</style>
