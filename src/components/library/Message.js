import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'
// 创建DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-messgae-container')
document.body.appendChild(div)

// 定时器
let timer = null
export default ({ type, text }) => {
  // 渲染组件
  // 1 导入消息提示组件
  // 2 将消息提示组件编译成虚拟节点
  // createVNode(组件，属性对象（props）)
  const Vnode = createVNode(XtxMessage, { type, text })
  // 3 准备一个装载消息提示组件的DOM容器
  // 4 将虚拟节点渲染到容器中
  // render(虚拟节点，DON容器)
  render(Vnode, div)
  // 3s后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
