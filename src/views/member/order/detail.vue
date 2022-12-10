<template>
  <div class="member-detail" v-if="order">
    <!-- 头部 -->
    <DetailAction :order="order" />
    <!-- 进度 -->
    <!-- 物流 -->
    <!-- 信息 -->
  </div>
</template>

<script>
import { findOrderDetail } from '@/api/order'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action.vue'
export default {
  name: 'MemberDetail',
  components: { DetailAction },
  setup() {
    const order = ref(null)
    const route = useRoute()
    findOrderDetail(route.params.id).then((data) => {
      order.value = data.result
    })
    return { order }
  }
}
</script>
<style lang="less" scoped>
.member-detail {
  background: #fff;
  height: 100%;
}
</style>
