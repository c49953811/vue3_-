<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="fliterData && !flitLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="fliterData.selectedBrand = item.id"
          :class="{ active: item.id === fliterData.brands.selectedBrand }"
          href="javascript:;"
          v-for="item in fliterData.brands"
          :key="item.id"
          >{{ item.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="item in fliterData.saleProperties" :key="item.id">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="item.selectedProp = prop.id"
          :class="{ active: prop.id === item.selectedProp }"
          href="javascript:;"
          v-for="prop in item.properties"
          :key="prop.id"
          >{{ prop.name }}</a
        >
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script setup name="SubFilter">
import { findSubCategoryFilter } from '@/api/category'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// 监听二级类目id的变化筛选数据
const fliterData = ref(null)
const flitLoading = ref(false)
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && `/category/sub/${newVal}` === route.path) {
      console.log('111111111111111')
      flitLoading.value = true
      // 获取数据
      findSubCategoryFilter(route.params.id).then((data) => {
        // 给每一组筛选条件 添加全部选项 =》全部就是没有筛选条件
        // 给每一组数据加上一个选中的id
        data.result.selectedBrand = null
        // 1 品牌
        data.result.brands.unshift({ id: null, name: '全部' })
        // 2 属性
        data.result.saleProperties.forEach((item) => {
          item.selectedProp = null
          item.properties.unshift({ id: null, name: '全部' })
        })
        fliterData.value = data.result
        flitLoading.value = false
      })
    }
  },
  { immediate: true }
)
</script>
<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>
