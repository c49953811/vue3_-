import request from '@/utils/request'
/**
 *
 * @param {integer} limit 品牌个数
 * @returns Promise
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}
/**
 * 获取新鲜好物
 *
 * **/
export const findNew = () => {
  return request('home/new', 'get')
}
/**
 * 获取人气推荐
 *
 * **/
export const findHot = () => {
  return request('home/hot', 'get')
}
/**
 * 获取商品板块
 * @returns
 */
export const findGoods = () => {
  return request('home/goods', 'get')
}
/**
 * 获取最新专辑
 * @returns
 */
export const findSpecial = () => {
  return request('home/special', 'get')
}
