import { getNewCartGoods } from '@/api/cart'

// 购物车模块
export default {
  namespaced: true,
  state: () => {
    return {
      // 购物车商品列表
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      // 有效商品 ， 库存大于0  stock，有效标识true  isEffective
      return state.list.filter((goods) => goods.stock > 0 && goods.isEffective)
    },
    // 数量，
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 总金额
    validAmount(state, getters) {
      return (
        getters.validList.reduce(
          (p, c) => p + parseInt(c.nowPrice * 100) * c.count,
          0
        ) / 100
      )
    },
    // 无效商品列表
    inValidList(state) {
      return state.list.filter(
        (goods) => goods.stock <= 0 || !goods.isEffective
      )
    },
    // 已选商品列表 ==>从有效商品列表中
    selectedList(state, getters) {
      return getters.validList.filter((item) => item.selected)
    },
    // 已选商品总件数 =->从已选商品列表中
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount(state, getters) {
      return (
        getters.selectedList.reduce(
          (p, c) => p + parseInt(c.nowPrice * 100) * c.count,
          0
        ) / 100
      )
    },
    // 是否全选
    isCheckAll(state, getters) {
      //      已选择商品                     有效商品
      return (
        getters.validList.length !== 0 &&
        getters.selectedList.length === getters.validList.length
      )
    }
  },
  mutations: {
    // 加入购物车
    insertCart(state, payload) {
      // 约定加入购物车需要的字段
      // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
      // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
      // findIndex =>找到返回索引，没找到返回-1
      const sameIndex = state.list.findIndex(
        (goods) => goods.skuId === payload.skuId
      )
      if (sameIndex > -1) {
        // 获取list中商品存储的数量
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来的商品
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart(state, goods) {
      const updateGoods = state.list.find((item) => item.skuId === goods.skuId)
      for (const key in goods) {
        if (
          goods[key] !== undefined &&
          goods[key] !== null &&
          goods[key] !== ''
        ) {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.findIndex((item) => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  actions: {
    // 加入购物车
    insertCart(ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart(ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 同时发送请求，等所有请求成功后，一起去修改本地数据
          // promise.all (promise数据).then((dataLise)=>{})
          const promiseArr = ctx.state.list.map((goods) => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList成功结果的集合，数据顺序跟promiseArr顺序一致，他又是根据state.list得来，所有skuId可以根据索引用state.list的skuID
          Promise.all(promiseArr)
            .then((dataList) => {
              // console.log(result)
              // 更新本地购物车
              dataList.forEach((data, i) => {
                ctx.commit('updateCart', {
                  skuId: ctx.state.list[i].skuId,
                  ...data.result
                })
              })
              resolve()
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }
      })
    },
    // 删除购物车商品
    deleteCart(ctx, payload) {
      // payload 现在是skuId
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车商品
    updateCart(ctx, payload) {
      // payload 必须有skuId 可能有selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选按钮
    checkAllCart(ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.getters.validList.forEach((goods) => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除 isClear =》ture 清空失效商品
    batchDeleteCart(ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 找出选中的商品，调用删除
          ctx.getters[isClear ? 'inValidList' : 'selectedList'].forEach(
            (item) => {
              ctx.commit('deleteCart', { skuId: item.skuId })
            }
          )
          resolve()
        }
      })
    },
    // 修改规格
    updateCartSku(ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 找出旧的商品信息，删除旧的，
          const oldGoods = ctx.state.list.find(
            (item) => item.skuId === oldSkuId
          )
          ctx.commit('deleteCart', oldSkuId)
          // 根据新的sku和旧的商品信息，合并新信息，添加新的商品
          const {
            skuId,
            price: nowPrice,
            specsText: attrsText,
            inventory: stock
          } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    }
  }
}
