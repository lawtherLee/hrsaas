import request from '@/utils/request'

export function login(data) {

}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export const getUserDetailById = (id) => request({
  url: `/sys/user/${id}`,
  method: 'get'
})

/**
 * 保存用户信息
 * @param data
 * @returns {*}
 */
export const saveUserDetailByIdAPI = (data) => request({
  url: `/sys/user/${data.id}`,
  method: 'PUT',
  data
})

export function logout() {
}
