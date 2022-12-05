<template>
  <Form
    class="xtx-form"
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    autocomplete="off"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          :class="{ error: errors.account }"
          v-model="form.account"
          name="account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ error: errors.mobile }"
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ error: errors.code }"
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span @click="send" class="code">{{
          time === 0 ? '发送验证码' : `${time}秒`
        }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ error: errors.password }"
          v-model="form.password"
          name="password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ error: errors.rePassword }"
          v-model="form.rePassword"
          name="rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { reactive, ref, onUnmounted } from 'vue'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/shared'
import Message from '@/components/library/Message'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const form = reactive({
      account: null,
      password: null,
      rePassword: null,
      mobile: null,
      code: null
    })
    // 校验规则
    const mySchema = {
      // 校验规则，返回true校验成功，返回一个字符串就是失败，字符串是error
      account: schema.accountApi,
      password: schema.password,
      rePassword: schema.rePassword,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }
    // 发送短信验证
    const formCom = ref(null)
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
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功!' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息， setFieldError(字段，错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 立即绑定

    const submit = async () => {
      const valid = await formCom.value.validate()

      if (valid) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        })
          .then((data) => {
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
            Message({ type: 'success', text: 'QQ注册成功!' })
          })
          .catch((e) => {
            Message({
              type: 'error',
              text: '注册失败'
            })
          })
      }
    }
    return { form, mySchema, send, formCom, time, submit }
  }
}
</script>

<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
