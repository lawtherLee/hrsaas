// 引入要注册的组件
// 把组件用数组收集起来
// Vue.use(plugin)
// plugin可以是 对象/函数 对象有install属性，函数有install方法
// import PageTool from '@/components/PageTool'

// const components = [PageTool]

// export default {
//   install: Vue => {
//     components.forEach(ele => {
//       Vue.component(ele.name, ele)
//     })
//   }
// }
import * as filters from '@/filters'

// 实现组件的自动注册
const fn = require.context('./', true, /\.vue$/)
console.log(fn.keys()) // 路径的集合
console.log(fn('./PageTool/index.vue')) // 根据路径查找模块

const components = fn.keys().map(ele => {
  return fn(ele)
})

export default Vue => {
  components.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })
  // 循环注册过滤器
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}
