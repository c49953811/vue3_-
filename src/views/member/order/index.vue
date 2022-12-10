<template>
  <div class="member-order">
    <!-- jsx -->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrederItem
        @on-loistics="handlerLogistics"
        @on-confirm="handlerConfirm"
        @on-delete="handlerDelete"
        @on-cancel="handlerCancel"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
    </div>
    <!-- 分页组件 -->
    <XtxPagination
      v-if="total > reqParams.pageSize"
      @current-page="reqParams.page = $event"
      :total="total"
      :page-size="reqParams.pageSize"
      :current-page="reqParams.page"
    />
    <!-- 取消原因组件 -->
    <OrderCancel ref="orderCancelCom" />
    <OrederLogistics ref="orderLogisticsCom" />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrederItem from './components/order-item'
import OrederLogistics from './components/order-logistics'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import OrderCancel from './components/order-cancel'
import Message from '@/components/library/Message'
import confirm from '@/components/library/confirm'
export default {
  name: 'MemberOrder',
  components: { OrederItem, OrderCancel, OrederLogistics },
  setup() {
    const activeName = ref('all')
    // 获得数据
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const orderList = ref([])
    const loading = ref(false)
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then((data) => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    // 筛选条件变化，重新加载
    watch(
      reqParams,
      () => {
        getOrderList()
      },
      { immediate: true }
    )

    // 切换 tab
    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }
    // 分页
    const total = ref(0)

    // 删除订单
    const handlerDelete = (order) => {
      confirm({ text: '您确认删除该条订单吗？' })
        .then(() => {
          deleteOrder(order.id).then(() => {
            Message({ text: '删除成功', type: 'success' })
            getOrderList()
          })
        })
        .catch(() => {})
    }
    return {
      activeName,
      orderStatus,
      tabClick,
      orderList,
      loading,
      total,
      reqParams,
      handlerDelete,
      ...useConfirm(),
      ...useCancel(),
      ...useLogistics()
    }
  }
}
// 取消订单
const useCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}
// 确认收货
const useConfirm = () => {
  const handlerConfirm = (order) => {
    confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' })
      .then(() => {
        confirmOrder(order.id).then(() => {
          Message({ text: '确认收货成功', type: 'success' })
          // 待收货 =》 待评价
          order.orderState = 4
        })
      })
      .catch(() => {})
  }
  return { handlerConfirm }
}
// 查看物流
const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>
<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
