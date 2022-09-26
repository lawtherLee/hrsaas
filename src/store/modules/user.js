import { login } from '@/api/login'
export default {
  namespaced: true,
  state: {
    token: null,
    name: '12312'
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      // 接口
      const data = await login(loginData)
      commit('SET_TOKEN', data)
    }
  }
}
