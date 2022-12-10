<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          @click="changeItem(item)"
          v-for="item in currList"
          :key="item.code"
          >{{ item.name }}</span
        >
      </template>
    </div>
  </div>
</template>
<script>
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
import { computed, ref, reactive } from 'vue'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup(porps, { emit }) {
    const visible = ref(false)
    const loading = ref(false)
    // 接收所有省市区数据
    const allCityData = ref([])
    // 打开
    const open = () => {
      visible.value = true
      loading.value = true
      getCityData().then((data) => {
        allCityData.value = data
        loading.value = false
      })
      // 清空之前的选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    // 关闭
    const clos = () => {
      visible.value = false
    }
    // 提供一个切换函数
    const toggle = () => {
      visible.value ? clos() : open()
    }
    // 点击组件外部元素进行关闭
    const target = ref(null)
    onClickOutside(target, () => {
      clos()
    })
    // 计算属性获取当前显示的地区数据
    const currList = computed(() => {
      // 默认省一级
      let list = allCityData.value
      // 市一级
      if (changeResult.provinceCode) {
        list = list.find((p) => p.code === changeResult.provinceCode).areaList
      }
      // 区一级
      if (changeResult.cityCode) {
        list = list.find((c) => c.code === changeResult.cityCode).areaList
      }
      return list
    })
    // 定义选择的省市区市局
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 点击时候记录数据
    const changeItem = (item) => {
      // 省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      // 区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 选完后关闭对话框，通知父组件
        clos()
        emit('change', changeResult)
      }
    }

    return { visible, toggle, target, loading, currList, changeItem }
  }
}
// 获取省市区数据函数
const getCityData = () => {
  // 数据地址 https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  //  当本地没缓存，发请求获取数据  异步
  //  当本地有缓存，取出本地数据    同步
  //  返回Promise
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url =
        'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then((res) => {
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
