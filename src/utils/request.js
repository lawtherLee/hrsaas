// 实现对axios
import axios from 'axios'
// 通过axiso 创建 axios 实例
const service = axios.create({
  baseUrl: '/dev', // 基准地址
  timeout: 5000
})
export default service

