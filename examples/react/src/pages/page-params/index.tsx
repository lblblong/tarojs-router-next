import { View } from '@tarojs/components'
import React, { FC } from 'react'
import { Router } from 'tarojs-router-next'
import './index.css'

const Index: FC = () => {
  const params = Router.getParams()
  return (
    <View className="index">
      <View>上一个页面带来的参数：</View>
      <View>{JSON.stringify(params)}</View>
    </View>
  )
}

export default Index
