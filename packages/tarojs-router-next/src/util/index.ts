import Taro from '@tarojs/taro'
import QueryString from 'query-string'
import { ROUTE_KEY } from '../constants'
import { Route } from '../router/type'

export function getCurrentRouteKey(): string {
  if (!Taro.Current.page) {
    return ''
  }
  return Taro.Current.page[ROUTE_KEY]
}

export function formatPath(route: Route, params: object) {
  let url = route.url
  const urlSplit = url.split('?')
  if (urlSplit.length > 1 && urlSplit[1]) {
    const urlParams = QueryString.parse(url.split('?')[1])
    params = Object.assign(urlParams, params)
    url = urlSplit[0]
  }

  let paramsStr = QueryString.stringify(params, { encode: false })
  url = `${url}?${paramsStr}`

  return url
}
