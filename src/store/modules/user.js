import { login } from '@/api/login'
import { getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    RMOVE_USER_INFO(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      // 接口
      const data = await login(loginData)
      commit('SET_TOKEN', data)
    },
    async getUserInfo({ commit }) {
      // 接口请求
      const res = await getUserInfo()
      const res1 = await getUserDetailById(res.userId)
      const result = { ...res, ...res1 }
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result)) // 后面会用的
    }
  }
}
