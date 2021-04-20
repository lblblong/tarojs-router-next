<template>
  <view class="index">
    <view>上一个页面带来的参数(请忽略 route_key )：</view>
    <view>{{ JSON.stringify(params) }}</view>

    <view>上一个页面带来的数据：</view>
    <view>{{ JSON.stringify(data) }}</view>
  </view>
</template>

<script lang="ts">
import { Router } from 'tarojs-router-next'
import './index.scss'

export default {
  setup() {
    const params = Router.getParams()
    const data = Router.getData()

    return {
      params,
      data,
    }
  },
}
</script>
