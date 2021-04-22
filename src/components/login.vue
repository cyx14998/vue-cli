<template>
  <div class="hello">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <el-button class="button" type="primary" @click="()=>{this.$router.push({ path: '/', params: { userId: 123 } })}">
      go to index
    </el-button>
    <el-select class="select" v-model="value" clearable placeholder="请选择" @change="change" v-loading="loading">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div v-if="result">
      <p>{{result.content}}</p>
    </div>
  </div>
</template>

<script>
import { get } from '@/api/login';
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App of login page',
      options: [{
        value: '黄金糕',
        label: '黄金糕'
      }, {
        value: '双皮奶',
        label: '双皮奶'
      }, {
        value: '蚵仔煎',
        label: '蚵仔煎'
      }, {
        value: '龙须面',
        label: '龙须面'
      }, {
        value: '北京烤鸭',
        label: '北京烤鸭'
      }],
      value: '',
      result: '',
      loading: false
    }
  },
  created () {

  },
  methods: {
    change (data) {
      this.loading = true
      get({ key: 'free', appid: 0, msg: data }).then((e) => {
        this.result = e
        this.loading = false
      }).catch((e) => {
        console.log(e)
      })
    }
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
