import Taro from '@tarojs/taro'
import { ROUTE_KEY } from '../constants'

export function getCurrentRouteKey(): string {
  if (!Taro.Current.page) {
    return ''
  }
  return Taro.Current.page[ROUTE_KEY]
}
