/*
 * @Author: robert zhang
 * @Date: 2020-05-05 10:19:05
 * @LastEditTime: 2020-05-18 20:48:40
 * @LastEditors: robert zhang
 * @Description: 商品管理路由
 * @
 */

import GoodsCate from '@/components/goods/GoodsCate.vue'
import GoodsParams from '@/components/goods/GoodsParams.vue'

export default [
  { path: '/categories', component: GoodsCate },
  { path: '/params', component: GoodsParams }
]
