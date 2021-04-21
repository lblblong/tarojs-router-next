import React, { FC } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { Router } from 'tarojs-router-next'
import './index.css'

const Index: FC = () => {
  const data = Router.getData()
  return (
    <View className="index">
      <View>上一个页面带来的数据：</View>
      <View>{JSON.stringify(data)}</View>
    </View>
  )
}

export default Index
