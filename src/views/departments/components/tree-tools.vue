<template>
  <el-row align="middle" justify="space-between" style="height:40px;width: 100%;" type="flex">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <span style="margin-right:8px;">{{ treeNode.manager }}</span>
        <el-dropdown>
          <span>操作<i class="el-icon-arrow-down el-icon--right" /></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>添加子部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot">编辑子部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot">删除子部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'HrsaasTreeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {}
  },

  mounted() {

  },

  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
