<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" subTitle="新鲜出炉 品质靠谱">
      <div ref="target" style="position: relative; height: 426px">
        <!-- 面板内容 -->
        <transition name="fade">
          <ul v-if="list.length" class="goods-list">
            <li v-for="item in list" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" alt="" />
                <p class="name">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else />
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script setup name="HomeHot">
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks'
// const list = ref([])
// findHot().then((data) => {
//   list.value = data.result
// })
const { result: list, target } = useLazyData(findHot)
</script>
<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
