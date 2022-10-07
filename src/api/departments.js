import request from '@/utils/request'

/**
 * 获取组织架构数据
 **/
export function getDepartmentsAPI() {
  return request({
    url: '/company/department'
  })
}

export function addDepartmentsAPI(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

export function updateDepartmentsAPI(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

export function delDepartmentsAPI(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
