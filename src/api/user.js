import request from '@/utils/system/request'

// 登录api
export function loginApi(data) {
  console.log(data)
  let a = {"status":"200","data":[{"UserName":"Username","Token":"Token"}]}
  return a
}

// 获取用户信息Api
export function passwordChange(data) {
  return request({
    url: '/user/passwordChange',
    method: 'post',
    baseURL: '/mock',
    data
  })
}
