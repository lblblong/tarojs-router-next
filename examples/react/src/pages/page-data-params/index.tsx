import { View } from '@tarojs/components'
import React, { FC } from 'react'
import { Router } from 'tarojs-router-next'
import './index.css'

const Index: FC = () => {
  const params = Router.getParams()
  const data = Router.getData()

  return (
    <View className="index">
      <View>上一个页面带来的参数：</View>
      <View>{JSON.stringify(params)}</View>

      <View>上一个页面带来的数据：</View>
      <View>{JSON.stringify(data)}</View>
    </View>
  )
}

export default Index
