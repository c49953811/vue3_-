import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import cart from './models/cart'
import user from './models/user'
import catrgory from './models/catrgory'
export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    cart,
    user,
    catrgory
  },
  // 配置插件
  plugins: [
    createPersistedState({
      // 本地存储名字
      key: 'erabbit-client-pc-124-store',
      // 制定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
