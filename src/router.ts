import Taro from '@tarojs/taro'
import compose from 'koa-compose'
import { RouterConfig, IRoute, NavigateOptions, NavigateType, ROUTE_KEY } from './common'
import { PageData } from './page-data'
import { formatPath } from './utils'

export class Router {
  private static _config?: RouterConfig

  /** 初始化配置 */
  static config(config: RouterConfig) {
    Router._config = config
  }

  /**
   * 页面跳转
   * @param route 目标路由对象
   * @param options 跳转选项
   */
  static async navigate<T = Taro.General.CallbackResult>(route: IRoute, options?: NavigateOptions): Promise<T> {
    options = { ...{ type: NavigateType.navigateTo, params: {} }, ...options }
    if (options.params![ROUTE_KEY]) throw Error('params 中 route_key 为保留字段，请用其他名称')
    const route_key = (options.params![ROUTE_KEY] = Date.now() + '')

    let url = formatPath(route, options.params!)

    if (options.data) {
      PageData.setPageData(route_key, options.data)
    }

    const middlwares = [...(Router._config?.middlewares || []), ...(route.beforeRouteEnter || [])]
    const fn = compose(middlwares)
    await fn({ route, params: options.params })

    return new Promise((res, rej) => {
      PageData.setPagePromise(route_key, { res, rej })

      switch (options!.type) {
        case NavigateType.reLaunch:
          Taro.reLaunch({ url })
          break
        case NavigateType.redirectTo:
          Taro.redirectTo({ url })
          break
        case NavigateType.switchTab:
          Taro.switchTab({ url })
          break
        default:
          Taro.navigateTo({ url })
          break
      }
    })
  }

  /**
   * 返回上一个页面
   * @param route 当没有页面可以返回，前往的页面
   */
  static back(route?: IRoute) {
    const currentPages = Taro.getCurrentPages()
    if (currentPages.length > 1) {
      return Taro.navigateBack()
    }

    route = route || Router._config?.backRootRoute
    if (route) {
      return Router.navigate(route, { type: NavigateType.redirectTo })
    } else {
      console.error('没有页面可以回退了')
      return Promise.resolve()
    }
  }

  /** 发送 backData、backError 数据到上一个页面 */
  static emitBack() {
    PageData.emitBack()
  }

  /**
   * 获取上一个页面携带过来的数据
   * @param default_data 默认数据
   */
  static getData<T = any>(default_data?: T): T | undefined {
    return PageData.getPageData(default_data)
  }

  /**
   * 返回上一个页面并返回数据。
   * 如果是 class 页面组件，请在页面级组件使用 @RouterEmit 装饰，
   * 如果是函数组件，请调用 useRouter，否则 backData 无法成功返回数据到上一个页面
   * @param data 返回的数据
   */
  static backData(data?: any) {
    PageData.setBackData(data)
    return Router.back()
  }

  /**
   * 返回上一个页面并抛出异常
   * 如果是 class 页面组件，请在页面级组件使用 @RouterEmit 装饰，
   * 如果是函数组件，请调用 useRouter，否则 backError 无法成功抛出异常到上一个页面
   * @param err 抛出的异常
   */
  static backError(err: any) {
    PageData.setBackError(err)
    return Router.back()
  }
}
