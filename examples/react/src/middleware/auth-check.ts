import Taro from '@tarojs/taro'
import { Middleware, Router } from 'tarojs-router-next'

export const AuthCheck: Middleware<{ mustLogin: boolean }> = async (ctx, next) => {
  if (ctx.route.ext?.mustLogin) {
    const token = Taro.getStorageSync('token')
    if (!token) {
      const { confirm } = await Taro.showModal({
        title: '提示',
        content: '请先登录',
      })

      if (confirm) Router.toLogin()

      throw Error('该页面必须要登陆：' + ctx.route.url)
    }
  }

  await next()
}
