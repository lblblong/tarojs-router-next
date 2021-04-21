<template>
  <view class="index">
    <button @tap="onLogin">立即登录</button>
  </view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
import { Router } from 'tarojs-router-next'
import { sleep } from '../../utils'
import './index.scss'

export default {
  setup() {
    const onLogin = async () => {
      Taro.showLoading({ title: '登陆中' })
      await sleep()
      Taro.hideLoading()
      Taro.setStorageSync('token', '我是token')
      Router.back()
    }
    return {
      onLogin,
    }
  },
}
</script>
