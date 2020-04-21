import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 自定义图标
import '@/assets/font/iconfont/iconfont.css'
// 导入全局样式
import '@/assets/css/global.css'

import service from '@/request'
Vue.prototype.$http = service

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
