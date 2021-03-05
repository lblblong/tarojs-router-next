import Taro from '@tarojs/taro'
import { IRoute, ROUTE_KEY } from './common'

/** @internal */
export function object2Url(data: any) {
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
export function url2Object(url: string) {
  const result = {}
  let paramStr = url.split('?')[1]
  if (paramStr) {
    let params = paramStr.split('&')
    for (const str of params) {
      let key = str.split('=')[0]
      let value = str.split('=')[1]
      result[key] = value
    }
  }

  return result
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
  const urlSplit = url.split('?')
  if (urlSplit.length > 1 && urlSplit[1]) {
    const urlParams = url2Object(url)
    if (urlParams[ROUTE_KEY]) throw Error('url 中 route_key 为保留字段，请用其他名称')
    params = Object.assign(urlParams, params)
    url = urlSplit[0]
  }

  let paramsStr = object2Url(params)
  url = `${url}?${paramsStr}`

  return url
}
