import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
    browserType: '1', // 浏览器类型
    activeName: 'indexFrame', // 框架名称
    filterParams: {
        frameName: '',
        isDelete: '-1'
    },  // 查询筛选 params
    nodeId: -1,
    route: '', // 框架路径
    isLeaf: 0, // 是否是叶子节点 1是 0否
}
const getters = {
    getBrowsersType: state => {
        return state.browserType;
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
    setBrowsersType (state, browserType) {
        state.browserType = browserType;
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
    },
    setIsLeaf (state, isLeaf) {
        state.isLeaf = isLeaf;
    }
}
const actions = {
    setBrowsersType (context, browserType) {
        context.commit('setBrowsersType', browserType);
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
    },
    setIsLeaf (context, isLeaf) {
        context.commit('setIsLeaf', isLeaf);
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});


















