import { useEffect } from 'react'
import { useRouter as useRouterTaro } from '@tarojs/taro'
import { PageData } from './page-data'
import { Router } from './router'

type Params = { [key: string]: any }

export function useRouter(defaultParams?: any) {
  useEffect(() => {
    return () => {
      PageData.emitBack()
    }
  }, [])
  const { params }: { params: Params } = useRouterTaro()
  const data = PageData.getPageData()

  return {
    /** 路由参数 */
    params: { ...params, ...defaultParams },
    /** 上一个页面携带过来的数据 */
    data,
    /** 返回上一个页面并返回数据 */
    backData: PageData.backData,
    /** 返回上一个页面并抛出异常 */
    backError: PageData.backError,
    /** 返回上一个页面 */
    back: Router.back
  }
}