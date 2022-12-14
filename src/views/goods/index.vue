<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem to="/">{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <!-- 名字区组件 -->
        <div class="spec">
          <GoodsName :goods="goods" />
          <!-- 规格组件 -->
          <GoodsSku
            :goods="goods"
            skuId="1369155868389543937"
            @change="changeSku"
          />
          <!-- 数量选择组件 -->
          <XtxNumbox v-model="num" label="数量" :max="goods.inventory" />
          <!-- 加入购物车组件 -->
          <XtxButton @click="insertCart" type="primary" style="margin-top: 20px"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+周榜 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findGoods } from '@/api/product'
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup() {
    const goods = useGoods()
    const changeSku = (sku) => {
      // 修改商品现价 原价 库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      currSku.value = sku
    }
    // 提供goods数据给后代
    provide('goods', goods)
    const num = ref(1)
    const store = useStore()
    // sirrsku 空对象代表商品选项没选完，不允许添加购物车
    const currSku = ref(null)
    // 加入购物车
    const insertCart = () => {
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store
          .dispatch('cart/insertCart', {
            // 约定加入购物车需要的字段
            skuId,
            attrsText,
            stock,
            id,
            name,
            price,
            nowPrice: price,
            picture: mainPictures[0],
            count: num.value,
            selected: true,
            isEffective: true
          })
          .then(() => {
            Message({ type: 'success', text: '添加购物车成功' })
          })
      } else {
        Message({ text: '商品规格不完整' })
      }
    }
    return { goods, changeSku, num, insertCart }
  }
}

// 获取商品详情
const useGoods = () => {
  const route = useRoute()
  const goods = ref(null)
  watch(
    () => route.params.id,
    (newVal) => {
      // 有路由id且
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(route.params.id).then((data) => {
          // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
          goods.value = null
          nextTick(() => {
            goods.value = data.result
          })
        })
      }
    },
    { immediate: true }
  )

  return goods
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
