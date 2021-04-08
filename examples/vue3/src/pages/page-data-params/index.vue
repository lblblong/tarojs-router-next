<template>
  <view class="index">
    <view>上一个页面带来的参数(请忽略 route_key )：</view>
    <view>{{ JSON.stringify(params) }}</view>

    <view>上一个页面带来的数据：</view>
    <view>{{ JSON.stringify(data) }}</view>
  </view>
</template>

<script>
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Router, useRouterVue } from 'tarojs-router-next'
import { sleep } from '../../utils'
import { ref, onBeforeMount } from 'vue'
import './index.scss'
import { toMe } from '../../router'

export default {
  setup() {
    const { params, data } = useRouterVue()

    return {
      params,
      data,
    }
  },
}
</script>
