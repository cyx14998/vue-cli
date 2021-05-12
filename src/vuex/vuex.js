import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
    browsersType: '1', // 浏览器类型
    activeName: 'indexFrame', // 框架名称
    filterParams: {
        name: '',
        status: '0'
    },  // 查询筛选 params
}
const getters = {
    getBrowsersType: state => {
        return state.browsersType;
    },
    getActiveName: state => {
        return state.activeName;
    },
    getFilterParams: state => {
        return state.filterParams;
    }
}
const mutations = {
    setBrowsersType (state, browsersType) {
        state.browsersType = browsersType;
    },
    setActiveName (state, activeName) {
        state.activeName = activeName;
    },
    setFilterParams (state, filterParams) {
        state.filterParams = filterParams;
    }
}
const actions = {
    setBrowsersType (context, browsersType) {
        context.commit('setBrowsersType', browsersType);
    },
    setActiveName (context, activeName) {
        context.commit('setActiveName', activeName);
    },
    setFilterParams (context, filterParams) {
        context.commit('setFilterParams', filterParams);
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});


















