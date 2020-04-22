/*
 * @Author: robert zhang
 * @Date: 2020-04-22 22:51:55
 * @LastEditTime: 2020-04-22 23:17:50
 * @LastEditors: robert zhang
 * @Description: 用户管理路由,属于Home的子路由
 * @
 */
import Users from '@/components/user/Users.vue'

export default [
  {
    path: '/users',
    component: Users,
    name: 'users'
  }
]
