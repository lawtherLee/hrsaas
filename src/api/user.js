import request from '@/utils/request'

export function login(data) {

}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout() {
}
