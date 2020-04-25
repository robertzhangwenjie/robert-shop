/*
 * @Author: robert zhang
 * @Date: 2020-04-24 08:48:33
 * @LastEditTime: 2020-04-25 07:29:07
 * @LastEditors: robert zhang
 * @Description: 表单校验规则
 * @
 */

/**
 * @description: 判断用户名是否符合规范
 * @param {string}
 * @return: 
 */
function isValidUsername(username) {
  const reg = /^[a-zA-Z0-9]{5,18}$/
  return reg.test(username)
}

/**
 * @description: 手机号是否有效验证
 * @param {number or string} 
 * @return: boolean
 */
function isValidPhone(phoneNum) {
  const reg = /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/
  return reg.test(phoneNum)
}

export default { isValidPhone, isValidUsername }
