<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理123123" name="first">
          <el-row>
            <el-button type="primary" style="margin-left:10px;" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
          </el-row>
          <el-table
            v-loading="loading"
            style="width: 100%"
            :data="roleList"
          >
            <el-table-column
              label="序号"
              width="120"
              type="index"
            />
            <el-table-column
              label="角色名称"
              width="240"
              prop="name"
            />
            <el-table-column
              label="描述"
              prop="description"
            />
            <el-table-column label="操作" width="240">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end" align="middle" style="height:60px;">
            <el-pagination
              v-if="total>0"
              background
              layout="prev, pager, next, sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2,5,10,15]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form :model="companyInfo" label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <addRole ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
    <!-- @updage:dialog-visible  -->
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import addRole from './compoents/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex111',
  components: {
    addRole
  },
  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      loading: false,
      dialogVisible: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
        // total 大于0 并且 rows的length === 0 这种情况并不是正在的没有数据 是有的，要重新发起请求
        if (total > 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getRoleList()
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    },
    // 绑定点击事件
    // 拿到当前行这条数据
    // 回显再新增角色的组件上
    editRole(row) {
      // row 直接赋值给 addRole 的formData
      // 地址一样 指的是同一个对象
      console.log(row)
      this.$refs.addRole.formData = { ...row }
      this.dialogVisible = true
      // 优化 数据是引用类型 带来的问题
    },
    // 删除角色
    // 给删除按钮添加点击事件
    // 删除按钮需要二次确认
    async delRow(id) {
      // this.$confirm('确认删除该角色吗?', '提示', {
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(success => {
      //   console.log(success)
      // }).catch(cancel => {
      //   console.log(cancel)
      // })
      try {
        await this.$confirm('确认删除该角色吗?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // console.log('success')
        // 删除接口封装
        // 调用删除接口
        await deleteRole(id)
        // 刷新列表
        this.getRoleList()
      } catch (e) {
        console.log('cancel')
      }
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    }
    // 获取公司接口封装好
    // 拿到companyId
    // this.$store.state.user.userInfo.companyId
    // this.$store.getters.companyId
    // 调用 获取公司接口
    // 渲染页面

  }
}
</script>

<style lang="scss" scoped>

</style>
