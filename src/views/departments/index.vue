<template>
  <div v-loading="loading" class="departments-container">
    <el-card>
      <treeTools :is-root="false" :tree-node="company" />
    </el-card>
    <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
      <treeTools
        slot-scope="{data}"
        :tree-node="data"
        @addDept="handleAddDept"
        @editDept="editDept"
        @refreshList="getDepartments"
      />
    </el-tree>
    <add-dept ref="addDept" :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
  </div>
  <!-- // 1.组件抽取
  // 2.子组件 props 定义
  // 3.组件的应用 -->
</template>

<script>
import { getDepartmentsAPI } from '@/api'
import treeTools from './components/tree-tools.vue'
import { tranListToTreeData } from '@/utils'
import addDept from '@/views/departments/components/add-dept'

export default {
  name: 'HrsaasIndex',
  components: {
    treeTools,
    addDept
  },

  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: { name: '江苏传技股份有限公司', manager: '负责人', id: '' },
      depts: [],
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      try {
        this.loading = true
        const { depts, companyManage, companyName } = await getDepartmentsAPI()
        this.departs = tranListToTreeData(depts, '')
        this.company = { name: companyName, manager: companyManage }
      } finally {
        this.loading = false
      }
    },
    handleAddDept(node) {
      this.dialogVisible = true
      this.currentNode = node
    },
    editDept(node) {
      this.dialogVisible = true
      this.currentNode = { ...node }
      this.$refs.addDept.formData = { ...node }
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
