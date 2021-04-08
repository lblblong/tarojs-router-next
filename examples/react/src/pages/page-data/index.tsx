import React, { FC } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useRouter } from 'tarojs-router-next'
import './index.css'

const Index: FC = () => {
  const { data } = useRouter()
  return <View className='index'>
    <View>上一个页面带来的数据：</View>
    <View>{JSON.stringify(data)}</View>
  </View>
}

export default Index
