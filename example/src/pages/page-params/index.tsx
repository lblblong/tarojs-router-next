import React, { FC } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useRouter } from 'tarojs-router'
import './index.css'

const Index: FC = () => {
  const { params } = useRouter()
  return (
    <View className='index'>
      <View>上一个页面带来的参数：</View>
      <View>{JSON.stringify(params)}</View>
    </View>
  )
}

export default Index
