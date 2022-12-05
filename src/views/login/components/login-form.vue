<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      ref="formCom"
      class="form"
      :validation-schema="mySchema"
      v-slot="{ errors }"
      autocomplete="off"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" /> {{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" /> {{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" /> {{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="form.code"
              name="code"
              type="text"
              placeholder="请输入验证码"
            />
            <span @click="send" class="code">{{
              time === 0 ? '发送验证码' : `${time}秒`
            }}</span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" /> {{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" /> {{ errors.isAgree }}
        </div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
        alt=""
      />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message.js'
import {
  userAccountLogin,
  userMobileLoginMsg,
  userMobileLogin
} from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/shared'
export default {
  name: 'LongFrom',
  components: { Form, Field },
  setup() {
    // 切换短信登陆
    const isMsgLogin = ref(false)
    // 表单数据对象
    const form = reactive({
      isAgree: true,
      account: 'zhousg', // null,
      password: '123456', // null,
      mobile: '13197981502', // null,
      code: null
    })
    // 校验规则
    const mySchema = {
      // 校验规则，返回true校验成功，返回一个字符串就是失败，字符串是error
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 监听 isMsgLogin 重置表单
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 补充校验效果清除，Form组件提供resetForm()  v-if销毁
      //  formCom.value.resetForm()
    })
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 点击登陆 校验
    const login = async () => {
      // Form组件提供validate 函数作为表单校验 ，返回Promise
      const valid = await formCom.value.validate()
      if (valid) {
        try {
          let data = null
          // 如果是手机号登陆
          if (isMsgLogin.value) {
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
            // 复用重构
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
          // 存用户信息
          const { id, account, mobile, nickname, token } = data.result
          store.commit('user/setUser', {
            id,
            account,
            mobile,
            nickname,
            token
          })
          // 跳转
          router.push(route.query.redirectUrl || '/')
          Message({ type: 'success', text: '登陆成功!' })
        } catch (e) {
          if (e.response.data) {
            Message({
              type: 'error',
              text: e.response.data.message || '登陆失败'
            })
          }
        }
      }
    }
    // 原生
    const time = ref(0)
    // let timer = null
    // vueuse定时器
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      false
    )
    // 清除定时器
    onUnmounted(() => {
      pause()
    })
    // 发送验证码
    const send = async () => {
      // 点击发送验证码按钮前先验证手机号
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 先判断是否在倒计时
        if (time.value === 0) {
          // 成功才去发送请求，成功后开启60s倒计时
          await userMobileLoginMsg(form.mobile)
          // 原生
          time.value = 60
          // clearInterval(timer)
          // timer = setInterval(() => {
          //   time.value--
          //   if (time.value <= 0) {
          //     clearInterval(timer)
          //   }
          // }, 1000)
          // vueuse函数
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息， setFieldError(字段，错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    return { isMsgLogin, form, mySchema, formCom, login, send, time }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
