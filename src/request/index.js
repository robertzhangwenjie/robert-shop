/*
 * @Author: robert zhang
 * @Date: 2020-04-22 07:16:08
 * @LastEditTime: 2020-05-31 18:11:01
 * @LastEditors: robert zhang
 * @Description: 路由模块主文件
 */
import axios from 'axios'
import { Message } from 'element-ui'

const host = window.location.host
const baseURL = `http://${host}/api/private/v1`
const request = axios.create({
  baseURL,
  timeOut: 1000 * 12
})

request.interceptors.request.use(
  /**
  * @description: 路由请求拦截器，在发送请求时加入token
  * @param config axios请求对象
  * @return: axios请求对象
  */
  config => {
    if (config.url === 'login') {
      return config
    }
    const token = sessionStorage.getItem('token')
    // 将token存放到headers的authorization中
    if (token) {
      config.headers.Authorization = token
      return config
    }
  },
  err => {
    console.log(err)
    Message.error({
      message: '请求超时！'
    })
    return Promise.resolve(err)
  }
)

// 响应异常拦截
axios.interceptors.response.use(res => {
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400: err.message = '请求错误(400)'; break
      case 401: err.message = '未授权，请重新登录(401)'; break
      case 403: err.message = '拒绝访问(403)'; break
      case 404: err.message = '请求出错(404)'; break
      case 408: err.message = '请求超时(408)'; break
      case 500: err.message = '服务器错误(500)'; break
      case 501: err.message = '服务未实现(501)'; break
      case 502: err.message = '网络错误(502)'; break
      case 503: err.message = '服务不可用(503)'; break
      case 504: err.message = '网络超时(504)'; break
      case 505: err.message = 'HTTP版本不受支持(505)'; break
      default: err.message = `连接出错(${err.response.status})!`
    }
  } else {
    err.message = '连接服务器失败!'
  }
  Message.err({ message: err.message })
  // 请求出错的时候执行Promise.resolve(err) 保证所有的请求无论成功失败都可以在回调中收到通知
  return Promise.resolve(err)
}
)

export default request
