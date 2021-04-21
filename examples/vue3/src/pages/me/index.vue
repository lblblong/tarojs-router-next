<template>
  <view class="index">
    <text>该页面必须要登录，进得来说明已经登陆了</text>
    <view>我的信息 {{ JSON.stringify(userinfo) }}</view>
  </view>
</template>

<script lang="ts">
import { UserStore } from '../../store/user'
import './index.scss'

export default {
  setup() {
    return {
      userinfo: UserStore.userinfo,
    }
  },
}
</script>
