// 实现对axios
import axios from 'axios'
// 通过axiso 创建 axios 实例
const service = axios.create({
  baseUrl: process.env.VUE_APP_BASE_API, // 基准地址 /prod-api
  timeout: 5000
})
export default service

