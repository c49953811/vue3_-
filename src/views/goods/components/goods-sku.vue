<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            v-else
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
// 得到路径字典对象
const pathMap = {}
const spliter = '★'
const getPathMap = (skus) => {
  // 1得到所有sku集合 props.goods.skus
  // 2从所有sku筛选有效sku
  // 3 根据有效sku使用powee-set算法得到子集
  // 4根据子集往路径字典对象中存储key-value
  skus.forEach((sku) => {
    if (sku.inventory > 0) {
      // 计算当前有库存sku的子集
      // 例如：[1,2,3] =>[[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 得到可选值数组
      const valueArr = sku.specs.map((val) => val.valueName)
      // 得到可选值数组 子集
      const valueArrPowerSet = powerSet(valueArr)
      // 遍历子集，往pathMpa 插入数据
      valueArrPowerSet.forEach((arr) => {
        // 根据arr得到字符串的key，约定key是['蓝色'，'美国']=>'蓝色★美国'j
        const key = arr.join(spliter)
        // console.log(key, pathMap[key])
        // 给 pathMap 设置数据
        if (pathMap[key]) {
          // pathMap[key]有值'蓝色':'112'  push 蓝色:'113'
          pathMap[key].push(sku.id)
        } else {
          // pathMap[key]没值： 让他直接等于当前id'蓝色★美国':'112' 通过循环下次pathMap[key]（蓝色）有值就push
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 得到当前选中规格集合
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach((spec) => {
    const selectedVal = spec.values.find((val) => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 约定每个按钮的专题由本事的disabled数据控制
  specs.forEach((item, index) => {
    const SelectedValues = getSelectedValues(specs)
    item.values.forEach((val) => {
      // 2 判断当前是否选中，选中则不用判断
      if (val.selected) return
      // 3 拿到当前的值按照顺序套入选中的值数组
      SelectedValues[index] = val.name
      // 4 剔除undefined数据，按分隔符拼接key
      const key = SelectedValues.filter((value) => value).join(spliter)
      // 5 拿着key去路径字典插在书否有数据
      val.disabled = !pathMap[key]
      // val.disabled = !pathMap[val.name]
    })
  })
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1 找到skuId对应的sku数据
  const sku = goods.skus.find((sku) => sku.id === skuId)
  // 2 遍历所有按钮，按钮的值和sku记录的值相同就是选中
  if (sku) {
    goods.specs.forEach((item, index) => {
      const val = item.values.find(
        (val) => val.name === sku.specs[index].valueName
      )
      val.selected = true
    })
  }
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    //
    const pathMap = getPathMap(props.goods.skus)
    // 根据skuID,初始化默认选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化，更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1选中与取消选中，约定每个按钮都拥有自己的选择状态selected
    const changeSku = (item, val) => {
      // 如果val.disabled 就不执行后续
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach((valItem) => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将你选择的sku信息通知父组件skuId，price，oldPrice，inventory，specsText
      // 1 选择完整的sku组合按钮，才可以拿到这些信息
      // 2 不是完整的sku组合按钮，提交空对象
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(
        (v) => v
      )
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find((sku) => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1。。。这样的字符串
          // reduce p=>前一个值，n=>当前值 ''=>组合形式为字符串
          specsText: sku.specs
            .reduce((p, n) => `${p} ${n.name}:${n.valueName}`, '')
            .trim() // .replace(' ', '')
        })
      } else {
        // 父组件需要判断规格选择完整，不完整不能添加购物车
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
