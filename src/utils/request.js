import axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'  //引入element中的弹窗，这个不是必须的可根据项目来
import baseUrl from '@/utils/env'

axios.defaults.withCredentials = true;  //false  不跨域  true 跨域
// axios.defaults.headers.common['token'] = localStorage.getItem('token'); //设置请求头，这个是不是必须的

export default (options) => {
    let { url, params, method = "GET", headerType = "json" } = options
    let data = {}

    //设置请求头
    if (method === 'post') {   //post请求
        if (headerType === "json") {
            axios.defaults.headers["Content-Type"] = 'application/json;charset=UTF-8'
            data = params
        } else {
            axios.defaults.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
            data = Qs.stringify(params);
        }
    }

    //get请求
    if (method === 'get') {
        if (headerType == !'json') {
            axios.defaults.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        data = Qs.stringify(params);
        url = url + '?' + data
        data = {};
    }
    // 请求拦截
    axios.interceptors.request.use(function (config) {
        let token = localStorage.getItem("token")
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    //响应拦截
    // axios.interceptors.response.use(response => {
    //     if (response.headers && response.headers.token) {
    //         localStorage.setItem('token', response.headers.token)
    //     }
    //     if (response.data.statusCode == 20009) {  //这里的状态码是根据后台设置的来
    //         Message.error({ message: '登录过期，请重新登录' })
    //     }
    //     return response;
    // }, error => {
    //     return Promise.resolve(error.response)
    // })

    //发送请求
    return new Promise((resolve, reject) => {
        axios({
            baseURL: baseUrl,
            method,
            url: url,
            data: params,
            timeout: 1000 * 10
        }).then(result => {
            result && result.data ? resolve(result.data) : reject(result)
        }).catch(err => {
            Message.error(err)
            reject(err)
        })
    })
}