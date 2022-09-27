<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
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
              <el-button size="small" type="success">分配权限</el-button>
              <el-button size="small" type="primary">编辑</el-button>
              <el-button size="small" type="danger">删除</el-button>
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
        <el-tab-pane label="公司信息" name="second">公司信息</el-tab-pane>
      </el-tabs>
    </el-card>

    <addRole :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
    <!-- @updage:dialog-visible  -->
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
import addRole from './compoents/addRole.vue'
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
      dialogVisible: false
    }
  },

  mounted() {
    this.getRoleList()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
