<template>
  <el-row align="middle" justify="space-between" style="height:40px;width: 100%;" type="flex">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <span style="margin-right:8px;">{{ treeNode.manager }}</span>
        <el-dropdown @command="handleCommand">
          <span>操作<i class="el-icon-arrow-down el-icon--right" /></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="edit">编辑子部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="del">删除子部门</el-dropdown-item>
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

  methods: {
    handleCommand(type) {
      console.log(type)
      if (type === 'add') {
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {

      } else {

      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
