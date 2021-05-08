// 配置API接口地址
// var root = 'http://192.168.202.89:8080' //开发环境
var root = '/graphs_api/' 
var qs = require('querystring') // qs序列化，解决data传参，后台无法接受的问题
// 引用axios
import axios from 'axios'
import {
  resolve
} from 'path';

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}


function apiAxios(url, method, params,
  //   success = function () {}, failure = function (err) {
  //   console.log(err)
  // }
) {
  if (params) {
    params = filterNull(params)
  }
  // params.appid = '1'
  // params.token = 'eb86fa064482989312e2a1557ddb4032',
  //   params.PHPSESSID = PHPSESSID
  //params.PHPSESSID = 'edbufmev9l7l715ln2o3tpqj75'
  return axios({
    url,
    method: method,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false
  })
  // .then(function (res) {
  //   success(res.data)
  // })
  // .catch(function (err) {
  //   let res = err.response
  //   if (err) {
  //     failure(err)
  //   }
  // })
}
// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios(url, 'GET', params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios(url, 'POST', params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios(url, 'PUT', params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios(url, 'DELETE', params, success, failure)
  }
}