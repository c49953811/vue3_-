import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id - 商品ID
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}
/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelevantGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', { id, limit })
}
/**
 * 获取热榜商品
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findGoodsHot = ({ id, type, limit = 3 }) => {
  return request('/goods/hot', 'get', { id, type, limit })
}
/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品ID
 */
export const findGoodsCommentInfo = (id) => {
  // return request(`/goods/${id}/evaluate`, 'get')
  // axios遇到http https开头的地址不会加上基准地址
  return request(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    'get'
  )
}
/**
 * 查询商品评价列表
 * @param {String} id 商品ID
 * @param {Object} params
 * @returns
 */
export const findGoodsCommentList = (id, params) => {
  // return request(`/goods/${id}/evaluate`, 'get')
  // axios遇到http https开头的地址不会加上基准地址
  return request(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    'get',
    params
  )
}
