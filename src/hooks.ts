import { useEffect } from 'react'
import { useRouter as useRouterTaro } from '@tarojs/taro'
import { Router } from './router'


export function useRouter(defaultParams?: any) {
  useEffect(() => {
    return () => {
      Router.emitBack()
    }
  }, [])
  const { params } = useRouterTaro()
  const data = Router.getData()

  return {
    /** 路由参数 */
    params: { ...params, ...defaultParams },
    /** 上一个页面携带过来的数据 */
    data,
    /** 返回上一个页面并返回数据 */
    backData: Router.backData,
    /** 返回上一个页面并抛出异常 */
    backError: Router.backError,
    /** 返回上一个页面 */
    back: Router.back
  }
}