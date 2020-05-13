/*
 * @Author: robert zhang
 * @Date: 2020-04-22 07:16:08
 * @LastEditTime: 2020-05-05 10:20:50
 * @LastEditors: robert zhang
 * @Description: 
 * @
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'

// 导入模块路由
import home from '@/router/home'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login, name: 'login' },
  ...home
]

const router = new VueRouter({
  routes
})

// 全局前置导航守卫, to表示将要访问的路由对象，from表示从哪个路由对象导航
// next为一个必须要调用的函数，参数为跳转的路径
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next() // 无参数表示放行
  }
  // 获取token,判断是否登陆
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
