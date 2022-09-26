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

export function logout() {
}
