import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index',
        }, {
            path: '/index',
            name: 'index',
            component: resolve => require(["./pages/index.vue"], resolve),
            meta: {
                title: '数据浏览器后台'
            }
        }, {
            path: '/glIndex',
            name: 'glIndex',
            component: resolve => require(["./pages/glIndex.vue"], resolve),
            meta: {
                title: '钢联模板后台'
            }
        }
    ]
})