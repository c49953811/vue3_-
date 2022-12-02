<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="fliterData && !flitLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="changeBrand(item.id)"
          :class="{ active: item.id === fliterData.selectedBrand }"
          href="javascript:;"
          v-for="item in fliterData.brands"
          :key="item.id"
          >{{ item.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="item in fliterData.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a
          @click="changeProp(item, prop.id)"
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
import { ref, watch, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
const emit = defineEmits(['filter-change'])
const route = useRoute()
// 监听二级类目id的变化筛选数据
const fliterData = ref(null)
const flitLoading = ref(false)
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && `/category/sub/${newVal}` === route.path) {
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

// 获取筛选参数的函数
const getFilterParams = () => {
  const obj = { brandId: null, attrs: [] }
  // 品牌
  obj.brandId = fliterData.value.selectedBrand
  // 属性
  fliterData.value.saleProperties.forEach((item) => {
    // 默认参数null,只要修改item.selectedProp就有值
    if (item.selectedProp) {
      // 获得propertyName
      const prop = item.properties.find((prop) => prop.id === item.selectedProp)
      // 例子 groupName=>颜色 propertyName=》蓝色
      obj.attrs.push({ groupName: item.name, propertyName: prop.name })
    }
  })
  // 参考数据 {brandId:'',attrs:[{groupName:'',propertyName:''},{},...]}
  if (obj.attrs.length === 0) obj.attrs = null
  return obj
}

// 记录当前选择的品牌
const changeBrand = (BrandId) => {
  if (fliterData.value.selectedBrand === BrandId) return
  fliterData.value.selectedBrand = BrandId
  emit('filter-change', getFilterParams())
}
// 记录选择的属性
const changeProp = (item, PropId) => {
  if (item.selectedProp === PropId) return
  item.selectedProp = PropId
  emit('filter-change', getFilterParams())
}
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
