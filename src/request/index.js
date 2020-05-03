/*
 * @Author: robert zhang
 * @Date: 2020-04-22 07:16:08
 * @LastEditTime: 2020-05-03 01:51:22
 * @LastEditors: robert zhang
 * @Description: 路由模块主文件
 */
import axios from 'axios'

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
    return Promise.reject(err)
  }
)

export default request
