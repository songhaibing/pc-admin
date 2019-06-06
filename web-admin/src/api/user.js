import request from '@/utils/request'
const API='http://106.75.178.9:80'
export function login(data) {
  return request({
    url: API+`/oauth/token?grant_type=password&username=${data.username}&password=${data.password}`,
    method: 'post',
    auth:{
      username:'browser-client',
      password:'browser'
    },
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
