import Taro from '@tarojs/taro'
import { Middleware } from 'tarojs-router-next'
import { UserStore } from '../store/user'
import { sleep } from '../utils'

export const FetchInfo: Middleware<{ mustLogin: boolean }> = async (ctx, next) => {
  const token = Taro.getStorageSync('token')

  if (token && !UserStore.userinfo) {
    // 请求用户信息
    Taro.showLoading({ title: '请求用户信息中' })
    await sleep()
    UserStore.userinfo = {
      id: 11,
      name: 'lblblong',
    }
    Taro.hideLoading()
  }

  await next()
}
