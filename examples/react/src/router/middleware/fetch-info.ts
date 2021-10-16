import Taro from '@tarojs/taro'
import { registerMiddleware } from 'tarojs-router-next'
import { UserStore } from '../../store/user'
import { sleep } from '../../utils'

registerMiddleware(
  async (_, next) => {
    // 请求用户信息
    Taro.showLoading({ title: '请求用户信息中' })
    await sleep()
    UserStore.userinfo = {
      id: 11,
      name: 'lblblong',
    }
    Taro.hideLoading()
    await next()
  },
  // 中间件注册条件
  (_) => {
    // 仅当用户已登录且用户信息为空时才获取用户信息
    const token = Taro.getStorageSync('token')
    return token && !UserStore.userinfo
  }
)
