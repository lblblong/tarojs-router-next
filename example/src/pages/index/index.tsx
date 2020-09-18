import React, { FC } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.css'
import { toClassDemo, toMe, toPageData, toPageDataParams, toPageParams, toSelCity } from '../../router'

const data = [
  {
    name: '张三李四',
  },
  {
    name: '张三李四',
  },
]

const Index: FC = () => {
  const onSelCity = async () => {
    try {
      const res = await toSelCity()
      Taro.showModal({
        title: '数据',
        content: JSON.stringify(res),
      })
    } catch (err) {
      Taro.showModal({
        title: '提示',
        content: '用户取消选择',
      })
    }
  }

  const onPageData = () => {
    toPageData(data)
  }

  const onPageParams = () => {
    toPageParams(12)
  }

  const onPageDataParams = () => {
    toPageDataParams(12, data)
  }

  const onToMustLogin = () => {
    toMe()
  }

  const onClassDemo = async () => {
    try {
      const res = await toClassDemo(12, data)
      Taro.showModal({
        title: '数据',
        content: JSON.stringify(res),
      })
    } catch (err) {
      Taro.showModal({
        title: '提示',
        content: '抛出了异常',
      })
    }
  }

  return (
    <View className="index">
      <View>页面跳转传参、数据</View>
      <Button onClick={onSelCity}>跳转页面获取数据</Button>
      <Button onClick={onPageParams}>跳转页面携带参数（路由参数）</Button>
      <Button onClick={onPageData}>跳转页面携带数据</Button>
      <Button onClick={onPageDataParams}>跳转页面携带数据、参数</Button>
      <View>路由中间件</View>
      <Button onClick={onToMustLogin}>权限校验中间件示例</Button>
      <View>Class页面</View>
      <Button onClick={onClassDemo}>Class页面使用示例</Button>
    </View>
  )
}

export default Index
