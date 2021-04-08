import React, { FC } from 'react'
import { View } from '@tarojs/components'
import './index.css'
import { UserStore } from '../../store/user'

const Index: FC = () => {
  return (
    <View className="index">
      <View>该页面必须要登录，进得来说明已经登陆了</View>
      <View>我的信息：{JSON.stringify(UserStore.userinfo)}</View>
    </View>
  )
}

export default Index
