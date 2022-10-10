// 实现对axios
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const TimeOut = 3600 // s
// 对比时间是否超时
function IsCheckTimeOut() {
  const currentTime = Date.now() // 时间2 接口真正调用的时间
  const timeStamp = (currentTime - store.getters.hrsaasTime) / 1000
  return timeStamp > TimeOut // true 超时 / false
}

// 通过axiso 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址 /prod-api
  timeout: 5000
})
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 时间2 - 时间1 > token 超时的时间 ==》 token 登录失效
    if (IsCheckTimeOut()) { // 超时
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token 超时'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
service.interceptors.response.use(response => {
  // 1. 考虑把那些数据跑出去
  // 2. 接口成功 并且 业务成功
  // 3. 没有成功 Promise.reject 跑出错误
  const { message, data, success } = response.data
  if (success) { // 业务逻辑是成功
    return data
  }
  // 业务逻辑没有成功
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  if (error.response && error.response.status === 401) { // token 失效 登录状态失效
    store.dispatch('user/logout')
    router.push('/login')
    Message.error('token 超时')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default service

