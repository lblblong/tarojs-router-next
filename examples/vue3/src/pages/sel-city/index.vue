<template>
  <view class="index">
    <view class="item" v-for="(it, index) in cityList" :key="it.id" @tap="onSel(index)">{{ it.name }}</view>
    <button @tap="onCancel">取消选择</button>
  </view>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Router } from 'tarojs-router-next'
import './index.scss'

export default {
  setup() {
    const cityList = ref([
      {
        id: 1,
        name: '深圳',
      },
      {
        id: 2,
        name: '广州',
      },
    ])

    const onSel = (index: number) => {
      Router.back(cityList.value[index])
    }

    const onCancel = () => {
      Router.back(new Error('用户取消选择'))
    }

    return {
      cityList,
      onSel,
      onCancel,
    }
  },
}
</script>
