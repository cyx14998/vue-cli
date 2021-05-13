import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './theme/index.css'
import ElementUI from 'element-ui';
import "./static/css/base.css";
import axios from 'axios'
import $http from './utils/request'
Vue.prototype.$http = $http
Vue.prototype.$axios = axios
Vue.config.productionTip = false
import store from './vuex/vuex.js'
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')