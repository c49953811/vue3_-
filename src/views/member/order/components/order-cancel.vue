<template>
  <XtxDialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 取消原因列表 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a
          @click="curText = item"
          v-for="item in cancelReason"
          :key="item"
          href="javascript:;"
          :class="{ active: curText === item }"
        >
          {{ item }}
        </a>
      </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <XtxButton
        type="gray"
        @click="visibleDialog = false"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { ref } from 'vue'
import { cancelReason } from '@/api/constants'
import { cancelOrder } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'OrderCancel',
  setup() {
    const visibleDialog = ref(false)
    const currorder = ref(null)
    const open = (order) => {
      visibleDialog.value = true
      currorder.value = order
    }
    const curText = ref('')
    const submit = () => {
      if (!curText.value) return Message({ text: '请选择原因' })
      cancelOrder({
        orderId: currorder.value.id,
        cancelReason: curText.value
      }).then(() => {
        Message({ text: '取消订单成功', type: 'success' })
        currorder.value.orderState = 6
        visibleDialog.value = false
      })
    }
    return { visibleDialog, cancelReason, curText, open, submit }
  }
}
</script>
<style lang="less" scoped>
.xtx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
