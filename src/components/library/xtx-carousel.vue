<template>
  <div class="xtx-carousel" @mouseenter="stop" @mouseleave="autoPlayFn">
    <!--  轮播图容器 -->
    <ul class="carousel-body">
      <!--  -->
      <li
        class="carousel-item"
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ fade: index === i }"
      >
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" class="carousel-btn prev" @click="prev"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <!-- 下一张 -->
    <a href="javascript:;" class="carousel-btn next" @click="next"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <span
        @click="index = i"
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ active: index === i }"
      ></span>
    </div>
  </div>
</template>

<script setup name="XtxCarousel">
import { defineProps, ref, onMounted, onUnmounted } from 'vue'
const props = defineProps({
  // 轮播图数据
  sliders: {
    type: Array,
    default: () => []
  },
  // 是否自动轮播
  autoPlay: {
    type: Boolean,
    default: false
  },
  // 轮播间隔时长
  duration: {
    type: Number,
    default: 3000
  }
})
// 定义默认显示索引
const index = ref(0)

// 上一张
const prev = () => {
  if (index.value === 0) {
    index.value = props.sliders.length - 1
  } else {
    index.value--
  }
}
// 下一张
const next = () => {
  if (index.value === props.sliders.length - 1) {
    index.value = 0
  } else {
    index.value++
  }
}
// 自动轮播逻辑
let timer = null
const autoPlayFn = () => {
  if (!props.autoPlay) return
  timer = setInterval(() => {
    next()
  }, props.duration)
}
// 销毁定时器
const stop = () => {
  clearInterval(timer)
}
// 自动播放
onMounted(() => {
  autoPlayFn()
})
onUnmounted(() => {
  stop()
})
</script>
<script>
export default {
  name: 'XtxCarousel'
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
