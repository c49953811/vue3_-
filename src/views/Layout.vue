<template>
  <!-- 顶部通栏 -->
  <app-navbar></app-navbar>
  <!-- 头部组件 -->
  <app-header></app-header>
  <AppHeaderSticky></AppHeaderSticky>

  <!-- 内容容器 -->
  <div class="app-body">
    <!-- 二级路由 -->
    <router-view />
  </div>
  <!-- 底部组件 -->
  <app-footer></app-footer>
</template>

<script setup name="Layout">
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('category/getList')
</script>
<style lang="less" scoped>
.app-body {
  min-height: 600px;
}
</style>
