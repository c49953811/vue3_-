/
<template>
  <div class="xtx-pagination">
    <a
      @click="changePager(myCurrentPage - 1)"
      v-if="myCurrentPage > 1"
      href="javascript:;"
      >上一页</a
    >
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a
      @click="changePager(i)"
      :class="{ active: i === myCurrentPage }"
      href="javascript:;"
      v-for="i in pager.btnArr"
      :key="i"
      >{{ i }}</a
    >
    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      @click="changePager(myCurrentPage + 1)"
      v-if="myCurrentPage < pager.pageCount"
      href="javascript:;"
      >下一页</a
    >
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'

export default {
  name: 'XtxPagination',
  props: {
    //  总条数
    total: {
      type: Number,
      default: 100
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 一页多少
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup(props, { emit }) {
    // 需要数据：
    // 1，约定按钮个数5
    const count = 5
    // 2, 当前显示页码
    const myCurrentPage = ref(1)
    // 3，总页数= 总条数/每页条数 上取整
    const myTotal = ref(100)
    const myPageSize = ref(10)
    // 其他数据（总页数，起始按钮，结束按钮，按钮数组）
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      //  按钮个数和当前页码==》 起始按钮，结束按钮，按钮数组
      // 根据约定按钮个数获得前后按钮个数，下取整
      const offset = Math.floor(count / 2)
      // 获得起始按钮 再通过起始按钮获得结束按钮
      let start = myCurrentPage.value - offset
      let end = start + count - 1
      // 如果起始页码小于1需要处理
      if (start < 1) {
        start = 1
        // end不能大于总页数
        end = start + count - 1 > pageCount ? pageCount : start + count - 1
      }
      if (end > pageCount) {
        end = pageCount
        start = end - count + 1 < 1 ? 1 : end - count + 1
      }
      // 获得按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      // 提供计算属性数据
      return { pageCount, btnArr, start, end }
    })

    // 监听props变化 更新组件内部数据
    watch(
      props,
      () => {
        myTotal.value = props.total
        myPageSize.value = props.pageSize
        myCurrentPage.value = props.currentPage
      },
      { immediate: true }
    )
    // 切换分页函数
    const changePager = (page) => {
      if (myCurrentPage.value !== page) {
        myCurrentPage.value = page
        // 通知父组件
        emit('current-page', page)
      }
    }
    return { myCurrentPage, pager, changePager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
