// 复用函数

import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

/**
 *
 * @param {Object} target -Dom对象
 * @param {Function} apiFn -API函数
 */

export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
    target,
    // isIntersecting 是否进入可视区域，true是进入 false是移出
    // observerElement 被观察的dom
    ([{ isIntersecting }], observerElement) => {
      // 在此处可根据isIntersecting来判断，然后做业务
      if (isIntersecting) {
        stop()
        // 调用API函数
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    }
  )
  return { result, target }
}
