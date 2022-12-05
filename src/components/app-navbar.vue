<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <a href="javascript:;"
              ><i class="iconfont icon-user"></i>{{ profile.account }}</a
            >
          </li>
          <li><a @click="logout" href="javascript:;">退出登录</a></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup name="AppTopnav">
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const store = useStore()
const profile = computed(() => {
  return store.state.user.profile
})
const router = useRouter()
// 退出登陆
const logout = () => {
  // 清空 本地存储信息和vuex信息 跳转首页
  store.commit('user/setUser', {})
  router.push('/')
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      // ~ 选择当前选择器的后面，意思是这个li后面的所有li
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
