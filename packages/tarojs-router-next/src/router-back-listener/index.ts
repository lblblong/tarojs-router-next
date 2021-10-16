import { Current } from '@tarojs/taro'
import { Route } from '..'
import { RouterBackListener } from './type'

export { RouterBackListener }

export const routerBackListenerCollection: RouterBackListener[] = []

/** 注册全局路由返回监听 */
export function registerRouterBackListener(listener: RouterBackListener) {
  routerBackListenerCollection.push(listener)
}

export function execRouterBackListener(from: Route) {
  const to = {
    url: Current.router?.path || '',
  }
  for (const listener of routerBackListenerCollection) {
    listener(to, from)
  }
}
