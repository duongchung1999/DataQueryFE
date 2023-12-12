import { loginApi } from "@/api/user";

const state = () => ({
  token: "", // 登录token
  info: {}, // 用户信息
  LoginFlag:false // 是否需要登录
});

// getters
const getters = {
  token(state) {
    return state.token;
  },
};

// mutations
const mutations = {
  tokenChange(state, token) {
    state.token = token;
  },
  infoChange(state, info) {
    state.info = info;
  },
};

// actions
const actions = {
  // login by login.vue
  login({ commit, dispatch }, params) {
    return new Promise((resolve, reject) => {
      
      let res = loginApi(params);

      // loginApi(params).then((res) => {
        console.log(res)
        if (res.status == 200 && res.data.length>0) {
          commit("tokenChange", res.data[0].Token);
          // 存储token开始时间
          window.localStorage.setItem("tokenStartTime", new Date().getTime());
          dispatch("getInfo", res.data[0]).then((infoRes) => {
            resolve(res);
          });
        }else{
          resolve(res);
        }
      });
    // });
  },
  // get user info after user logined
  getInfo({ commit }, params) {
    return new Promise((resolve, reject) => {
        commit("infoChange", params);
        resolve(params.Token);
      });
  },

  loginOut({ commit }) {
    commit("tokenChange", null);
    localStorage.removeItem("tabs");
    localStorage.removeItem("vuex");
    location.reload();
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
