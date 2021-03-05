import Taro from '@tarojs/taro'
import { IRoute, ROUTE_KEY } from './common'

/** @internal */
export function objectToUrlParams(data: any) {
  let _result: Array<any> = []
  for (let key in data) {
    let value = data[key]
    if (value === undefined || value === null) continue
    if (value.constructor === Array) {
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
export function getCurrentRouteKey(): string {
  const params = Taro.getCurrentInstance().router?.params
  if (!params || !params[ROUTE_KEY]) return ''
  return params[ROUTE_KEY] + ''
}

/** @internal */
export function formatPath(route: IRoute, params: object) {
  let url = route.url
  let paramsStr = objectToUrlParams(params)
  url = `${route.url}?${paramsStr}`

  return url
}
