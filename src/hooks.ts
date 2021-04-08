import { getCurrentInstance, useRouter as useRouterTaro } from '@tarojs/taro'
import { Router } from './router'

export function useRouter(defaultParams?: any) {
  const { useEffect } = require('react')
  useEffect(() => {
    const instance = getCurrentInstance()
    if (!instance.page) return
    const routerEmit = instance.page['routerEmit']
    if (routerEmit) return
    instance.page['routerEmit'] = true
    const originOnUnload = instance.page.onUnload
    instance.page.onUnload = () => {
      originOnUnload()
      Router.emitBack()
    }
  }, [])
  const { params } = useRouterTaro()
  const data = Router.getData()

  return {
    /** 路由参数 */
    params: { ...defaultParams, ...params },
    /** 上一个页面携带过来的数据 */
    data,
    /** 返回上一个页面并返回数据 */
    backData: Router.backData,
    /** 返回上一个页面并抛出异常 */
    backError: Router.backError,
    /** 返回上一个页面 */
    back: Router.back,
  }
}

export function useRouterVue(defaultParams?: any) {
  const { onBeforeMount } = require('vue')
  const instance = getCurrentInstance()

  onBeforeMount(() => {
    if (!instance.page) return
    const routerEmit = instance.page['routerEmit']
    if (routerEmit) return
    instance.page['routerEmit'] = true
    const originOnUnload = instance.page.onUnload
    instance.page.onUnload = () => {
      originOnUnload()
      Router.emitBack()
    }
  })

  const params = instance.router?.params
  const data = Router.getData()
  return {
    /** 路由参数 */
    params: { ...defaultParams, ...params },
    /** 上一个页面携带过来的数据 */
    data,
    /** 返回上一个页面并返回数据 */
    backData: Router.backData,
    /** 返回上一个页面并抛出异常 */
    backError: Router.backError,
    /** 返回上一个页面 */
    back: Router.back,
  }
}
