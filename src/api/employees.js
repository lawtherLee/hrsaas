import request from '@/utils/request'

export function getEmployeeSimpleAPI() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeListAPI(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/** **
 *  新增员工的接口
 * **/
export function addEmployeeAPI(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 *
 * @param id 员工id
 * @returns {*}
 */
export function delEmployeeAPI(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/** *
 *  封装一个导入员工的接口
 *
 * ***/

export function importEmployeeAPI(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 获取员工信息
 * @param id
 * @returns {*}
 */
export const getEmployeesInfoAPI = id => {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 * 保存员工基本信息
 * @param data
 * @returns {*}
 */
export const saveEmployeesInfoAPI = data => {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}

/**
 * 获取员工岗位信息
 * @param id 员工id
 * @returns {Promise}
 */
export const getEmployeesJobInfoAPI = id => {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * @param data
 * @returns {*}
 */
export const saveEmployeesJobInfoAPI = data => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}
