<template>
  <view class="index">
    <view>页面跳转传参、数据</view>
    <button type="primary" @tap="onSelCity">跳转页面获取数据</button>
    <button type="primary" @tap="onPageDataParams">跳转页面携带数据、参数</button>
    <view>路由中间件</view>
    <button type="primary" @tap="onToMustLogin">权限校验中间件示例</button>
  </view>
</template>

<script>
import { toSelCity, toMe, toPageDataParams } from '../../router'
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import './index.scss'

const data = [
  {
    name: '张三李四',
  },
  {
    name: '张三李四',
  },
]

export default {
  setup() {
    const onSelCity = async () => {
      try {
        const res = await toSelCity()
        Taro.showModal({
          title: '数据',
          content: JSON.stringify(res),
        })
      } catch (err) {
        console.log(err)
        Taro.showModal({
          title: '提示',
          content: '用户取消选择',
        })
      }
    }

    const onToMustLogin = () => {
      toMe()
    }

    const onPageDataParams = () => {
      toPageDataParams(12, data)
    }

    return {
      onSelCity,
      onToMustLogin,
      onPageDataParams
    }
  },
}
</script>
