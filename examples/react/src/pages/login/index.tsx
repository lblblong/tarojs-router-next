import React, { FC } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.css'
import { Router } from 'tarojs-router-next'
import { sleep } from '../../utils'

const Index: FC = () => {
  return (
    <View className="index">
      <Button
        onClick={async() => {
          Taro.showLoading({title:'登陆中'})
          await sleep()
          Taro.hideLoading()
          Taro.setStorageSync('token', '我是token')
          Router.back()
        }}
      >
        立即登录
      </Button>
    </View>
  )
}

export default Index
