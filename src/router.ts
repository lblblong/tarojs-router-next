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

  /** 页面跳转 */
  static async navigate<T = Taro.General.CallbackResult>(
    route: IRoute,
    options?: NavigateOptions
  ): Promise<T> {
    options = { ...{ type: NavigateType.navigateTo, params: {} }, ...options }
    if (options.params![ROUTE_KEY]) throw Error('params 中 route_key 为保留字段，请用其他名称')
    const route_key = options.params![ROUTE_KEY] = Date.now() + ''

    let url = formatPath(route, options.params!)

    if (options.data) {
      PageData.setPageData(route_key, options.data)
    }

    const middlwares = Router._config?.middlewares || []
    try {
      const fn = compose(middlwares)
      await fn({ route, params: options.params })
    } catch (err) {
      throw err
    }

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
   * @param url 退无可退的时候进入的页面
   */
  static back(url?: string) {
    const currentPages = Taro.getCurrentPages()
    if (currentPages.length > 1) {
      Taro.navigateBack()
      return
    }

    if (url) {
      Taro.reLaunch({ url })
    } else if (Router._config?.rootPath) {
      Taro.reLaunch({ url: Router._config?.rootPath })
    } else {
      throw Error('没有页面可以返回')
    }
  }

  /** 发送 backData、backError 数据到上一个页面 */
  static emitBack() {
    PageData.emitBack()
  }

  /**
   * 获取上一个页面携带过来的数据 
   * @param default_data 当数据不存在时返回的默认数据
   */
  static getData<T = any>(default_data?: T): T | undefined {
    return PageData.getPageData(default_data)
  }

  /**
   * 返回上一个页面并返回数据
   * 如果是 class 页面组件，请使用 @RouterEmit 装饰器
   * 如果是函数组件，请调用 useRouter
   * @param data 返回的数据
   */
  static backData(data?: any) {
    PageData.setBackData(data)
    Router.back()
  }

  /**
   * 返回上一个页面并抛出异常
   * 如果是 class 页面组件，请使用 @RouterEmit 装饰器
   * 如果是函数组件，请调用 useRouter
   * @param err 需要抛出的异常
   */
  static backError(err: any) {
    PageData.setBackError(err)
    Router.back()
  }
}
