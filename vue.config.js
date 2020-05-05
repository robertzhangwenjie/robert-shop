/*
 * @Author: robert zhang
 * @Date: 2020-04-23 06:53:58
 * @LastEditTime: 2020-05-05 09:35:36
 * @LastEditors: robert zhang
 * @Description: 
 * @
 */
module.exports = {
  devServer : {
    port: 8000,
    open: true,
    proxy: {
      '/api/private/v1': {
        target: "http://robert.shop.yunxiao.com",
        changeOrigin: true //代理发送请求时，请求头中的host设置为target
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskTcon: 'favicon.ico',
      msTileImage: 'favicon.ico',
    }
  }
}