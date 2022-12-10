<template>
  <div class="member-detail" v-if="order">
    <!-- 头部 -->
    <DetailAction :order="order" />
    <!-- 进度 -->
    <DetailSteps :order="order" />
    <!-- 物流 -->
    <Suspense>
      <template #default>
        <DetailLogistics
          v-if="[3, 4, 5].includes(order.orderState)"
          :order="order"
        />
      </template>
      <template #fallback>
        <div class="loading">logding...</div>
      </template>
    </Suspense>
    <!-- 信息 -->
    <DetailInfo :order="order" />
  </div>
</template>

<script>
import { findOrderDetail } from '@/api/order'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action.vue'
import DetailSteps from './components/detail-steps.vue'
import DetailInfo from './components/detail-info.vue'
import DetailLogistics from './components/detail-logistics.vue'
export default {
  name: 'MemberDetail',
  components: { DetailAction, DetailSteps, DetailLogistics, DetailInfo },
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
