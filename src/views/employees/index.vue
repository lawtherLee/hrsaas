<template>
  <div class="app-container">
    <PageTool>
      <template #before>
        <span>共166条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary" @click="handleEmploy">新增员工</el-button>
      </template>
    </PageTool>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" :data="list" border>
        <el-table-column label="序号" sortable="" type="index" width="80" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column :formatter="formatterFn" label="聘用形式" prop="formOfEmployment">
          <!-- <template slot-scope="{row}">
            过滤器解决这个问题 文本格式化
            <span>{{ row.formOfEmployment }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <!-- {{value | g}} -->
        <!-- 格式化入职时间   -->
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch
              :value="row.enableState === 1"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="{row}">
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text">转正</el-button>
            <el-button size="small" type="text">调岗</el-button>
            <el-button size="small" type="text">离职</el-button>
            <el-button size="small" type="text">角色</el-button>
            <el-button size="small" type="text" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row align="middle" justify="end" style="height: 60px" type="flex">
        <el-pagination
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[2,5,10]"
          :total="total"
          layout="prev, pager, next,sizes,total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addEmployee :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import PageTool from '@/components/PageTool'
// 把结构复制进来 ==》 slot的旧语法 新语法
// 把接口封装复制进来
// 引入接口
// 调用接口
import EnumHireType from '@/api/constant/employees'
import { delEmployeeAPI, getEmployeeListAPI } from '@/api/employees'
import addEmployee from './components/add-employee.vue'

export default {
  name: 'HrsaasIndex',
  components: {
    addEmployee,
    PageTool
  },
  data() {
    return {
      page: {
        page: 1,
        size: 10
      },
      list: [],
      total: 0,
      loading: false,
      hireType: EnumHireType.hireType,
      dialogVisible: false
    }
  },

  mounted() {
    this.getEmployeeList()
    // console.log(this.$options.filters.checkCode)
  },
  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeListAPI(this.page)
        // 渲染数据
        this.list = rows
        this.total = total
      } finally {
        this.loading = false
      }
    },
    formatterFn(row, column, cellValue) {
      const res = this.hireType.find(ele => ele.id === cellValue)
      return res?.value
    },
    handleEmploy() {
      // 点击的时候 需要弹出新增员工的弹窗
      // 新增员工的弹窗 抽成一个组件
      // 实现弹窗组件的显示和隐藏
      this.dialogVisible = true
    },
    async del(id) {
      try {
        await this.$confirm('确认删除该员工吗', '提示', { type: 'warning' })
        await delEmployeeAPI(id)
        await this.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
