<template>
  <div class="departments-container">
    <el-card>
      <treeTools :is-root="false" :tree-node="company" />
    </el-card>
    <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
      <treeTools slot-scope="{data}" :tree-node="data" />
    </el-tree>
  </div>
  <!-- // 1.组件抽取
  // 2.子组件 props 定义
  // 3.组件的应用 -->
</template>

<script>
import { getDepartmentsAPI } from '@/api'
import treeTools from './components/tree-tools.vue'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'HrsaasIndex',
  components: {
    treeTools
  },

  data() {
    return {
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name'
      },
      company: { name: '江苏传技股份有限公司', manager: '负责人' },
      depts: []
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      const { depts, companyManage, companyName } = await getDepartmentsAPI()
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage }
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;

  .el-card__body {
    padding-right: 0px !important;
  }
}
</style>
