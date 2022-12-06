<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  // 原生写法
  // setup(props, { emit }) {
  //   const checked = ref(false)
  //   const changeChecked = () => {
  //     checked.value = !checked.value
  //     emit('updata:modelValue', checked.value)
  //   }
  //   watch(
  //     () => props.modelValue,
  //     () => {
  //       checked.value = props.modelValue
  //     },
  //     { immediate: true }
  //   )
  //   return { checked, changeChecked }
  // }
  // 用vue/core库
  setup(props, { emit }) {
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件
      checked.value = newVal
      emit('change', newVal) // =>让组件支持change事件
    }
    return { checked, changeChecked }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
