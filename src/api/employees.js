import request from '@/utils/request'

export function getEmployeeSimpleAPI() {
  return request({
    url: '/sys/user/simple'
  })
}
