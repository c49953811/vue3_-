import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

// 创建DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)
// 返回promise ，无论取消确认都销毁组件
export default ({ title, text }) => {
  // 1导入 2 createVNode创虚拟节点
  // 3 准备DOM容器4 render渲染组件到容器
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const vn = createVNode(XtxConfirm, {
      title,
      text,
      submitCallback,
      cancelCallback
    })
    render(vn, div)
  })
}
