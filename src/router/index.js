import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

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
      },
      {
        path: '/cart',
        component: () => import('@/views/cart/index')
      },
      {
        path: '/member/checkout',
        component: () => import('@/views/member/pay/checkout.vue')
      },
      {
        path: '/pay/callback',
        component: () => import('@/views/member/pay/result.vue')
      },
      {
        path: '/member/pay',
        component: () => import('@/views/member/pay')
      },
      {
        path: '/member',
        component: () => import('@/views/member/Layout'),
        children: [
          { path: '/member', component: () => import('@/views/member/home') },
          // {
          //   path: '/member/order',
          //   component: () => import('@/views/member/order')
          // },
          // {
          //   path: '/member/order/:id',
          //   component: () => import('@/views/member/order/detail.vue')
          // }
          {
            path: '/member/order',
            component: { render: () => h(RouterView) },
            children: [
              {
                path: '',
                component: () => import('@/views/member/order')
              },
              {
                path: ':id',
                component: () => import('@/views/member/order/detail.vue')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/login/callback.vue')
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

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 需要登陆的路由，地址是以 /member 开头  约定好的
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (!token && to.path.startsWith('/member')) {
    // next({ path: '/login', query: { redirectUrl: to.fullPath } })
    next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})
export default router
