import Taro from '@tarojs/taro'
import QueryString from 'query-string'
import { isBrowser, ROUTE_KEY } from '../constants'
import { Route } from '../router/type'

export function getCurrentRouteKey(): string {
  const params = Taro.getCurrentInstance().router?.params
  if (!params || !params[ROUTE_KEY]) return ''
  return params[ROUTE_KEY] + ''
}

export function formatPath(route: Route, params: object) {
  let url = route.url
  const urlSplit = url.split('?')
  if (urlSplit.length > 1 && urlSplit[1]) {
    const urlParams = QueryString.parse(url.split('?')[1])
    if (urlParams[ROUTE_KEY]) throw Error('url 中 route_key 为保留字段，请用其他名称')
    params = Object.assign(urlParams, params)
    url = urlSplit[0]
  }

  let paramsStr = QueryString.stringify(params, { encode: false })
  url = `${url}?${paramsStr}`

  return url
}

export function platformPageId(url: string) {
  if (isBrowser) {
    return url
  } else {
    return url.split('?')[0].slice(1)
  }
}
