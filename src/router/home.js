/*
 * @Author: robert zhang
 * @Date: 2020-04-22 07:16:08
 * @LastEditTime: 2020-04-25 22:43:07
 * @LastEditors: robert zhang
 * @Description: home页面的路由对象
 * @
 */
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import user from '@/router/user'
import rights from '@/router/rights'
export default [
  {
    path: '/home',
    component: Home,
    name: 'home',
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome, name: 'welcome' },
      ...user,
      ...rights

    ]
  }
]
