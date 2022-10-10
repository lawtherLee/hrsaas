<template>
  <upload-excel :on-success="handleSuccess" />
</template>

<script>
// header  ['手机号', '姓名', '入职日期', '转正日期', '工号']
// results  [{ '入职日期': 43678, '姓名': '高大山', '工号': 20089, '手机号': 13041131879, '转正日期': 43678 }]
// 后端接口要的数据：[{ 'timeOfEntry': 43678, 'username': '高大山', 'workNumber': 20089, 'mobile': 13041131879, 'correctionTime': 43678 }]

import { importEmployeeAPI } from '@/api'

export default {
  name: 'HrsaasIndex',
  components: {},
  methods: {
    // 实现批量新增员工
    async handleSuccess({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      console.log(arr)
      await importEmployeeAPI(arr)
      this.$message.success('批量导入成功')
      this.$router.back()
    }
  }

}
</script>

<style scoped>

</style>
