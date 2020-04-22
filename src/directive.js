/*
 * @Author: robert zhang
 * @Date: 2020-04-22 19:48:54
 * @LastEditTime: 2020-04-22 21:38:08
 * @LastEditors: robert zhang
 * @Description: 自定义指令
 * @
 */

import Vue from 'vue'

Vue.directive('focus', {
  inserted(el) {
    el.children[0].focus()
  }
})
