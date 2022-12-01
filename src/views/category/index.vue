<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>{{ TopCategory.name }}</XtxBreadItem>
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
      <!-- 各个分类推荐商品 -->
    </div>
  </div>
</template>

<script setup name="TopCategory">
import { findBanner } from '@/api/home'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

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
</style>
