<template>
  <view class="index">
    <view>页面跳转传参、数据</view>
    <button type="primary" @tap="onSelCity">跳转页面获取数据</button>
    <button type="primary" @tap="onPageDataParams">跳转页面携带数据、参数</button>
    <view>路由中间件</view>
    <button type="primary" @tap="onToMustLogin">权限校验中间件示例</button>
  </view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
import { Router } from 'tarojs-router-next'
import './index.scss'

const data = {
  users: [
    {
      id: 1,
      name: '张三',
      sex: 'boy' as const,
    },
    {
      id: 2,
      name: '小辉',
      sex: 'girl' as const,
    },
  ],
}

const params = {
  id: 1,
  name: '张三',
  sex: 'boy' as const,
}

export default {
  setup() {
    const onSelCity = async () => {
      try {
        const res = await Router.toSelCity()
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

    return {
      onSelCity,
      onToMustLogin: () => Router.toMe(),
      onPageDataParams: () =>
        Router.toPageDataParams({
          params,
          data,
        }),
    }
  },
}
</script>
