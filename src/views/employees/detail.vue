<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="用户管理" lazy name="first">
            <el-form ref="form" :model="accountInfo" :rules="accountInfoRules">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="accountInfo.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="accountInfo.password" type="password" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="配置管理" lazy name="second">
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="角色管理" lazy name="third">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailByIdAPI } from '@/api'
import JobInfo from '@/views/employees/components/job-info'
import UserInfo from '@/views/employees/components/user-info'
import Cookies from 'js-cookie'

export default {
  name: 'Detail',
  components: { JobInfo, UserInfo },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      accountInfo: {},
      accountInfoRules: {
        username: [
          { required: true, message: '请输入员工名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 6, message: '长度最小6', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadEmployeesInfo()
  },
  methods: {
    async loadEmployeesInfo() {
      this.accountInfo = await getUserDetailById(this.$route.params.id)
    },
    async updateEmployees() {
      try {
        await this.$refs.form.validate()
        await saveUserDetailByIdAPI(this.accountInfo)
        this.$message.success('更新成功')
      } catch (e) {
        console.log(e)
        console.log(1)
      }
    },
    tabClick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style scoped>

</style>
