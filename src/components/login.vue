<template>
  <div class="hello">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <el-button class="button" type="primary" @click="()=>{this.$router.push({ path: '/', params: { userId: 123 } })}">
      go to index
    </el-button>
    <el-select class="select" v-model="value" clearable placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import { get } from '@/api/login';
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App of login page',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  created () {
    get({ key: 'free', appid: 0, msg: '测试' }).then((e) => {
      console.log(e)
    }).catch((e) => {
      console.log(e)
    })
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.button {
  color: @primary;
}
.select {
  margin-left: 20px;
}
</style>
