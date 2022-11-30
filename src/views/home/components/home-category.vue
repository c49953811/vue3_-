<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="item in menuList" :key="item.id">
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <template v-if="item.children">
          <!-- 二级类目 -->
          <RouterLink
            v-for="sub in item.children"
            :key="sub.id"
            :to="`/catrgory/sub/${sub.id}`"
            >{{ sub.name }}</RouterLink
          >
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup name="HomeCategory">
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
// 最终数据 9分类+1个品牌
const brand = reactive({
  id: 'brand',
  name: '品牌',
  children: [{ id: 'brand-chilren', name: '品牌推荐' }]
})
const menuList = computed(() => {
  // 得到8个分类，且每个一级分类下的子分类有两个
  const list = store.state.category.list.map((item) => {
    return {
      id: item.id,
      name: item.name,
      // 有且只要展示两个
      children: item.children && item.children.slice(0, 2),
      goods: item.goods
    }
  })
  list.push(brand)
  return list
})
</script>

<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
