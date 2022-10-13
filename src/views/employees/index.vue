<template>
  <div class="app-container">
    <PageTool>
      <template #before>
        <span>共166条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
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
            <el-button size="small" type="text" @click="goDetail(row)">查看</el-button>
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
// import { export_json_to_excel } from '@/vendor/Export2Excel'

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
    },
    // 导出
    async exportExcel() {
      // 文件懒加载
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows } = await getEmployeeListAPI({ page: 1, size: this.total })
      console.log(rows)
      const exportExcelMapPath = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map(item => {
        return header.map(h => {
          if (h === '聘用形式') {
            const find = this.hireType.find(hire => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return find ? find.value : '未知'
          }
          return item[exportExcelMapPath[h]]
        })
      })
      export_json_to_excel({
        header, // 表头 必填
        data, // 具体数据 必填
        filename: '黑马员工列表', // 非必填
        autoWidth: true, // 宽度自适应
        bookType: 'xlsx' // 文件类型
      })
    },
    goDetail(row) {
      this.$router.push('/employees/detail/' + row.id)
    }
  }
}
</script>
