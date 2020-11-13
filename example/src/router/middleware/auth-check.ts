import { IMiddleware } from "tarojs-router";
import Taro from '@tarojs/taro'
import { toLogin } from "..";

export const AuthCheck: IMiddleware<{ mustLogin: boolean }> = async (ctx, next) => {
  if (ctx.route.ext?.mustLogin) {
    const token = Taro.getStorageSync('token')
    if (!token) {
      const { confirm } = await Taro.showModal({
        title: '提示',
        content: '请先登录'
      })

      if (confirm) toLogin()

      throw Error('该页面必须要登陆：' + ctx.route.url)
    }
  }

  await next()
}
