import { Button, View } from '@tarojs/components'
import React, { Component } from 'react'
import { Router } from 'tarojs-router-next'
import './index.css'

export default class App extends Component {
  state = {
    params: null,
    data: null,
  }

  componentDidShow() {
    this.setState({
      params: Router.getParams(),
      data: Router.getData(),
    })
  }

  render() {
    return (
      <View>
        <View>上一个页面带来的参数：</View>
        <View>{JSON.stringify(this.state.params)}</View>

        <View>上一个页面带来的数据：</View>
        <View>{JSON.stringify(this.state.data)}</View>

        <Button
          onClick={() => {
            Router.back({ name: '我是数据' })
          }}
        >
          返回并携带数据
        </Button>
        <Button
          onClick={() => {
            Router.back(Error('异常异常'))
          }}
        >
          返回并抛出异常
        </Button>
        <Button
          onClick={() => {
            Router.back()
          }}
        >
          返回不带数据
        </Button>
      </View>
    )
  }
}
