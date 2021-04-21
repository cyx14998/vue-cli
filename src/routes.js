import Vue from 'vue'
import VueRouter from 'vue-router'	//引入vue-router模块
Vue.use(VueRouter)	//声明安装路由
//这里就可以引用你要显示的页面了
import index from './components/index.vue'
import login from './components/login.vue'

//配置路由，path就是你浏览器地址，component就是跟着你要显示的页面，/表示默认地址。
var routes = [
    {
        path: "/",
        name: '/',
        component: index,
        meta: {
            title: '首页'
        },
    },
    {
        path: "/index",
        name: 'index',
        component: index,
        meta: {
            title: '首页'
        },
    },
    {
        path: "/login",
        name: 'login',
        component: login,
        meta: {
            title: '登陆页'
        },
    },
]

export default new VueRouter({ routes })