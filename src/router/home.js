/*
 * @Author: robert zhang
 * @Date: 2020-04-22 07:16:08
 * @LastEditTime: 2020-04-22 22:58:42
 * @LastEditors: robert zhang
 * @Description: home页面的路由对象
 * @
 */
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import user from '@/router/user'
export default [
  {
    path: '/home',
    component: Home,
    name: 'home',
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome, name: 'welcome' },
      ...user

    ]
  }
]
