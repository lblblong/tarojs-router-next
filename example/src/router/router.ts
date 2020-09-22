import { Router, NavigateType } from 'tarojs-router'
import { routes } from './route'

export function toIndex() {
  return Router.navigate(routes.index, {
    type: NavigateType.navigateTo
  })
}

export function toLogin() {
  return Router.navigate(routes.login)
}

export function toPageData(data: any) {
  return Router.navigate(routes.pageData, {
    data
  })
}

export function toPageParams(id: number) {
  return Router.navigate(routes.pageParams, { params: { id } })
}

export function toPageDataParams(id: number, data: any) {
  return Router.navigate(routes.pageDataParams, { params: { id }, data })
}

export function toSelCity() {
  return Router.navigate<{
    id: number
    name: string
  } | undefined>(routes.selCity)
}

export function toMe() {
  return Router.navigate(routes.me)
}

export function toClassDemo(id: number, data: any) {
  return Router.navigate<{ name: string } | undefined>(routes.classDemo, { params: { id }, data })
}