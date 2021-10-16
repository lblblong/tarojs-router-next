import Taro from '@tarojs/taro'
import { registerMiddleware, RouteContext, Router } from 'tarojs-router-next'

registerMiddleware(
  async (_, next) => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      const { confirm } = await Taro.showModal({
        title: '提示',
        content: '请先登录',
      })

      if (confirm) Router.toLogin()
      // 直接返回，不执行 next 即可打断中间件向下执行
      return
    }
    await next()
  },
  // 中间件注册条件
  (ctx: RouteContext<{ mustLogin: boolean }>) => {
    // 仅当页面需要登录时才注册该中间件
    return ctx.route.ext?.mustLogin === true
  }
)
