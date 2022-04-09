import QueryString from 'query-string'
import { Route } from '../router/type'

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
