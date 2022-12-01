<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</XtxBreadItem>
    <Transition name="fade-right">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{
        category.sub.name
      }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script setup name="SubBread">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// 1. 获取二级分类的ID，在地址在路由中
// route ===> this.$route
const route = useRoute()
// 2. 获取vuex中的类目数据
// store ===> this.$store
const store = useStore()
// 3. 通过计算属性得到，二级类目的名称和ID，一级类目的名称和ID
const category = computed(() => {
  const cate = {}
  // 完成获取数据逻辑
  store.state.category.list.forEach((top) => {
    if (top.children) {
      const sub = top.children.find((sub) => sub.id === route.params.id)
      if (sub) {
        // 设置一级类目
        cate.top = { id: top.id, name: top.name }
        // 设置二级类目
        cate.sub = { id: sub.id, name: sub.name }
      }
    }
  })

  return cate
})
</script>
<style lang="less" scoped></style>
