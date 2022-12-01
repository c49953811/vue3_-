<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 mode="out-in" -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right">
          <XtxBreadItem :key="TopCategory.id">{{
            TopCategory.name
          }}</XtxBreadItem>
        </transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in TopCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 各个分类关联商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem
            v-for="goods in sub.goods"
            :key="goods.id"
            :goods="goods"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="TopCategory">
import GoodsItem from './components/goods-item'
import { findBanner } from '@/api/home'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { findTopCategory } from '@/api/category'
// 轮播图
const sliders = ref([])
findBanner().then((data) => {
  sliders.value = data.result
})

// 面包屑+所有子分类
const route = useRoute()
const store = useStore()
const TopCategory = computed(() => {
  let cate = {}
  const item = store.state.category.list.find((item) => {
    return item.id === route.params.id
  })
  if (item) cate = item
  return cate
})
// 获取各个子类目下的商品
const subList = ref([])
const gidSubList = () => {
  findTopCategory(route.params.id).then((data) => {
    subList.value = data.result.children
  })
}
watch(
  () => route.params.id,
  (newVal) => {
    // newVal && gidSubList()
    // 如果路由有值，且点击的是一级类目（排除点击二级类目发请求）
    if (newVal && `/category/${newVal}` === route.path) {
      gidSubList()
    }
  },
  { immediate: true }
)
</script>
<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
