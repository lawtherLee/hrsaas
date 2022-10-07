<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="dialogVisible" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" style="width:80%" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" :rows="3" placeholder="1-300个字符" style="width:80%" type="textarea" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" justify="center" type="flex">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button v-loading="loading" size="small" type="primary" @click="submit"> 确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartmentsAPI, getEmployeeSimpleAPI, addDepartmentsAPI, updateDepartmentsAPI } from '@/api'

export default {
  name: 'AddDept',

  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    // 部门编码在整个模块不允许重复
    // 拿到所有的部门数据，一个个对比
    const codeCheck = async(rule, value, callback) => {
      const { depts } = await getDepartmentsAPI()
      console.log(depts)
      let isRepeat = true
      // 编辑模式下自己和自己校验
      // 解决方案 对比过程中把自己排除掉再去对比
      if (this.formData.id) {
        isRepeat = depts.some(ele => ele.id !== this.formData.id && ele.code === value)
      } else {
        isRepeat = depts.some(ele => ele.code === value)
      }
      isRepeat ? callback(new Error(`模块下已经存在${value}编码}`)) : callback()
    }

    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartmentsAPI()
      // 找同级部门
      let isRepeat = true
      if (this.formData.id) {
        const deptstj1 = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
        isRepeat = deptstj1.some(ele => ele.name === value)
      } else {
        const deptstj = depts.filter(item => item.pid === this.treeNode.id)
        console.log(deptstj)
        isRepeat = deptstj.some(ele => ele.name === value)
      }
      isRepeat ? callback(new Error(`该部门下已经存在${value}`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          { validator: nameCheck }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          { validator: codeCheck, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: [],
      loading: false
    }
  },

  computed: {
    title() {
      return this.formData.id ? '编辑模式' : '新增模式'
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addDeptForm.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimpleAPI()
    },
    async submit() {
      try {
        await this.$refs.addDeptForm.validate()
        this.loading = true
        // 编辑模式
        if (this.formData.id) {
          await updateDepartmentsAPI(this.formData)
        } else {
          await addDepartmentsAPI({ ...this.formData, pid: this.treeNode.id })
        }
        // 因为是添加子部门，需要将新增的部门pid设置成当前部门的id，新增的部门就成了自己的子部门
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}成功`)
        // 刷新了父组件的组织加购列表
        this.$parent.getDepartments()
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
