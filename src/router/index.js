import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { path: '/', component: () => import('@/views/home') },
      { path: '/category/:id', component: () => import('@/views/category') },
      {
        path: '/category/sub/:id',
        component: () => import('@/views/category/sub')
      },
      {
        path: '/product/:id',
        component: () => import('@/views/goods/index')
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    hidden: true,
    component: () => import('@/views/error/404.vue') // 这个是我自己的路径
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由返回顶部
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})

export default router
