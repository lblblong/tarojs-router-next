import Taro from '@tarojs/taro'
import { IRoute } from './interfaces'

/** @internal */
export function objectToUrlParams(data: any) {
  let _result: Array<any> = []
  for (let key in data) {
    let value = data[key]
    if (value === undefined || value === null) continue
    if (value.constructor == Array) {
      value.forEach(function (_value) {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}

/** @internal */
export function getCurrentRoute() {
  const currentPages = Taro.getCurrentPages()
  if (currentPages.length == 0) return null
  let currentPage = currentPages[currentPages.length - 1]
  return '/' + currentPage.route
}

/** @internal */
export function formatPath(route: IRoute, params?: object) {
  let url = route.url
  if (params) {
    let paramsStr = objectToUrlParams(params)
    url = `${route.url}?${paramsStr}`
  }

  return url
}