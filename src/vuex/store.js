import actions from './actions.js';
import state from './state.js';
import mutations from './mutations';
// 项目内vuex配置
import eduState from "PAGE/edu/vuex/state.js"
import eduMutations from "PAGE/edu/vuex/mutations.js"
import eduActions from "PAGE/edu/vuex/actions.js"
import indexState from "PAGE/index/vuex/state.js"
import indexMutations from "PAGE/index/vuex/mutations.js"
import indexActions from "PAGE/index/vuex/actions.js"
export default {
    state: {...state,...eduState,...indexState},
    mutations: {...mutations,...eduMutations,...indexMutations},
    actions: {...actions,...eduActions,...indexActions}
};