<template>
  <div class="home-banner">
    <XtxCarousel :sliders="sliders" autoPlay :duration="1000" />
  </div>
</template>

<script setup name="HomeBanner">
// import XtxCarousel from '@/components/library/xtx-carousel.vue'
import { ref } from 'vue'
import { findBanner } from '@/api/home'

// 获取轮播图数组
const sliders = ref([])
findBanner().then((data) => {
  sliders.value = data.result
})
</script>
<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
// 覆盖轮播图组件样式
.xtx-carousel {
  :deep(.carousel-btn.prev) {
    left: 270px;
  }
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>
