/*
 * @Author: robert zhang
 * @Date: 2020-04-22 07:16:08
 * @LastEditTime: 2020-04-22 21:32:25
 * @LastEditors: robert zhang
 * @Description: 主入口文件
 * @
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 自定义指令
import './directive'

// 自定义图标
import '@/assets/font/iconfont/iconfont.css'
import '@/assets/font/font-awesome-4.7.0/css/font-awesome.min.css'
// 导入全局样式
import '@/assets/css/global.css'

import service from '@/request'
Vue.prototype.$http = service

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
