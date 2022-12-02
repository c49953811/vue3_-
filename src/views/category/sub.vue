<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange" />
      <!-- 商品面板-排序组件+列表 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange" />
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 加载 -->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
        />
      </div>
    </div>
  </div>
</template>

<script setup name="SubCategory">
import { ref, watch } from 'vue'
import SubSort from './components/sub-sort'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter'
import GoodsItem from './components/goods-item'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
const route = useRoute()
// 加载中
const loading = ref(false)
// 是否加载完毕
const finished = ref(false)
// 商品列表数据
const goodsList = ref([])
// 请求参数
let reqParams = {
  page: 1,
  pageSize: 20
}
const getData = () => {
  loading.value = true
  // 设置二级分类ID
  reqParams.categoryId = route.params.id
  findSubCategoryGoods(reqParams).then(({ result }) => {
    // 判断reslut是否有数据
    if (result.items.length) {
      goodsList.value.push(...result.items)
      // 把数据改为下一页
      reqParams.page++
    } else {
      finished.value = true
    }
    loading.value = false
  })
}
// 切换二级分类重新加载
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && route.path === `/category/sub/${newVal}`) {
      goodsList.value = [] // 列表空导致加载更多组件进入可视区，重新加载数据
      reqParams = {
        page: 1,
        pageSize: 20
      }
      finished.value = false
    }
  }
)
// 1，更改排序组件的筛选数据，重新发起请求
const sortChange = (sortParams) => {
  finished.value = false
  // 合并请求参数，保留之前参数，page改为1
  reqParams = { ...reqParams, ...sortParams }
  reqParams.page = 1
  goodsList.value = []
}
// 2，更改筛选组件的筛选数据，重新发起请求
const filterChange = (filterParams) => {
  finished.value = false
  // 合并请求参数，保留之前参数，page改为1
  reqParams = { ...reqParams, ...filterParams }
  reqParams.page = 1
  goodsList.value = []
}
</script>
<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
