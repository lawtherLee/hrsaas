<template>
  <el-dialog
    :visible="dialogVisible"
    title="新增员工"
    @close="handleClose"
  >
    <!-- 表单 -->
    <el-form ref="addEmploy" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入姓名" style="width:80%" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" style="width:80%" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" placeholder="请选择入职时间" style="width:80%" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" placeholder="请选择" style="width:80%">
          <!--          <el-option :value="1" label="正式" />-->
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" placeholder="请输入工号" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" placeholder="请选择部门" style="width:80%" @focus="getDepartments" />
        <el-tree
          v-show="isShow"
          v-loading="loading"
          :data="treeData"
          :props="{label:'name'}"
          default-expand-all
          style="width:80%"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" placeholder="请选择转正时间" style="width:80%" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row justify="center" type="flex">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button size="small" type="primary" @click="okBtn">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import employeesEnum from '@/api/constant/employees'
import { tranListToTreeData } from '@/utils'
import { addEmployeeAPI, getDepartmentsAPI } from '@/api'
//  实现弹窗组件的显示和隐藏
//  其实 el-dialog 组件显示 隐藏 visible
//  父到子 props
//  点击关闭按钮 close $emit 去改父组件里的值 (upate:dialogVisible)
//  handleClose 完善 // 1. 表单重置 2.表单绑定的值从新赋值

export default {
  name: 'HrsaasAddEmployee',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      hireType: employeesEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 表单校验 步骤
      // el-form配置model和rules属性
      // el-form-item配置prop属性
      // 表单进行v-model双向绑定

      // 表单校验
      // 需求：
      // 用户名必填，username，长度为1-4位
      // 手机号必填，mobile，需满足 正则表达式 /^1[3-9]\d{9}$/
      // 聘用形式必填， formOfEmployment change
      // 工号必填，workNumber
      // 部门必填，departmentName change
      // 入职时间必填， timeOfEntry
      // 转正时间可选，correctionTime
      rules: {
        username: [
          { required: true, message: 'Please enter a username', trigger: 'blur' },
          { min: 1, max: 4, message: 'username 1~4', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please enter a mobile', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: 'mobile 不满足格式', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: 'Please enter a formOfEmployment' }
        ],
        timeOfEntry: [
          { required: true, message: 'Please enter a timeOfEntry' }
        ],
        workNumber: [
          { required: true, message: 'Please enter a workNumber', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: 'Please enter a departmentName' }
        ]
      },
      treeData: [],
      isShow: false,
      loading: false
    }
  },
  methods: {
    handleClose() {
      // 表单重置
      this.$refs.addEmploy.resetFields()
      // 重新赋值
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.isShow = false
      this.$emit('update:dialogVisible', false)
    },
    async getDepartments() {
      this.loading = true
      this.isShow = true
      const { depts } = await getDepartmentsAPI()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 回显树节点
    selectNode(node) {
      this.formData.departmentName = node.name
      this.isShow = false
    },
    async okBtn() {
      try {
        await this.$refs.addEmploy.validate()
        await addEmployeeAPI(this.formData)
        this.handleClose()
        this.$parent.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
