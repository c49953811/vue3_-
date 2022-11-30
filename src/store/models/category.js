// 分类模块
// 存储的分类数据
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state: () => {
    return {
      // 分类信息
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    //  定义show和hide函数，控制当前分类的二级分类显示隐藏
    show(state, id) {
      const currCartgpry = state.list.find((item) => item.id === id)
      currCartgpry.open = true
    },
    hide(state, id) {
      const currCartgpry = state.list.find((item) => item.id === id)
      currCartgpry.open = false
    }
  },
  actions: {
    async getList({ commit }) {
      const { result } = await findAllCategory()
      result.forEach((top) => {
        top.open = false
      })
      console.log(result, 'vuex获取分类数据')
      commit('setList', result)
    }
  }
}
