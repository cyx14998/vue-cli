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
    nodeId: -1,
    route: '', // 框架路径
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
    },
    getNodeId: state => {
        return state.nodeId;
    },
    getRoute: state => {
        return state.route;
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
    },
    setNodeId (state, nodeId) {
        state.nodeId = nodeId;
    },
    setRoute (state, route) {
        state.route = route;
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
    },
    setNodeId (context, nodeId) {
        context.commit('setNodeId', nodeId);
    },
    setRoute (context, route) {
        context.commit('setRoute', route);
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});


















