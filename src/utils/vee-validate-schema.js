// 给vee-validate 提供校验规则

import { userAccountCheck } from '@/api/user'

export default {
  // 用户名校验
  account(value) {
    // 非空
    if (!value) return '请输入用户名'
    // 规则：字母开头 6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  // 用户校验且校验唯一性
  async accountApi(value) {
    // 非空
    if (!value) return '请输入用户名'
    // 规则：字母开头 6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    const data = await userAccountCheck(value)
    console.log(data)
    if (data.result.valid) return '该用户名已存在'
    return true
  },
  // 密码校验
  password(value) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },
  // 确认密码
  rePassword(value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    if (value !== form.password) return '密码需要保持一致'
    return true
  },
  mobile(value) {
    if (!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  code(value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
    return true
  },
  isAgree(value) {
    if (!value) return '请勾选同意用户协议'
    return true
  }
}
