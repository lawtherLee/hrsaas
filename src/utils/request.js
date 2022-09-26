// 实现对axios
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// 通过axiso 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址 /prod-api
  timeout: 5000
})
service.interceptors.request.use(config => {
  if (store.getters.token) {
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
  Message.error(error.message)
  return Promise.reject(error)
})
export default service

