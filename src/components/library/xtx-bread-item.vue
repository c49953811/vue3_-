<template>
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <span v-else><slot /></span>
  </div>
</template>

<script setup name="XtxBreadItem">
import { defineProps } from 'vue'
defineProps({
  to: {
    type: [String, Object],
    default: ''
  }
})
</script>
<script>
export default {
  name: 'XtxBreadItem'
}
</script>
<style lang="less" scoped></style>
