/*
 * @Author: robert zhang
 * @Date: 2020-04-25 22:41:02
 * @LastEditTime: 2020-04-26 11:18:05
 * @LastEditors: robert zhang
 * @Description: 权限管理路由
 * @
 */

import Rights from '@/components/authority/Rights.vue'
import Roles from '@/components/authority/Roles.vue'
export default [
  { path: '/rights', component: Rights },
  { path: '/roles', component: Roles }
]
