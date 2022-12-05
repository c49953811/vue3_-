<template>
  <Form
    ref="formCom"
    class="xtx-form"
    :validation-schema="mySchema"
    autocomplete="off"
    v-slot="{ errors }"
  >
    <div class="user-info">
      <img :src="acatar" alt="" />
      <p>Hi， {{ nickname }}欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="绑定的手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ err: errors.code }"
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span @click="send" class="code">{{
          time === 0 ? '发送验证码' : `${time}秒`
        }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { reactive, ref, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/shared'
import Message from '@/components/library/Message'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const nickname = ref(null)
    const acatar = ref(null)
    if (QC.Login.check()) {
      QC.api('get_user_info').success((res) => {
        acatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
        console.log(res)
      })
    }
    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
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
          await userQQBindCode(form.mobile)
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
        userQQBindLogin({
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
            Message({ type: 'success', text: 'QQ绑定成功!' })
          })
          .catch((e) => {
            Message({
              type: 'error',
              text: '绑定失败'
            })
          })
      }
    }
    return { acatar, nickname, form, mySchema, formCom, send, time, submit }
  }
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
