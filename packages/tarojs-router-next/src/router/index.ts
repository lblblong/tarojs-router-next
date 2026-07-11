import Taro, { Current, getCurrentInstance } from '@tarojs/taro'
import { ROUTE_KEY } from '../constants'
import { NoPageException } from '../exception/no-page'
import { formatPath, isNil } from '../func'
import { execMiddlewares, getMiddlewares } from '../middleware'
import { PageData } from '../page-data'
import { execRouterBackListener } from '../router-back-listener'
import { NavigateOptions, NavigateType, Route } from './type'

export { NavigateOptions, NavigateType, Route } from './type'

export class Router {
  /**
   * 页面跳转
   * @param route 目标路由对象
   * @param options 跳转选项
   */
  static async navigate<T = any>(route: Route, options?: NavigateOptions): Promise<T> {
    options = { ...{ type: NavigateType.navigateTo, params: {} }, ...options }
    options.params = Object.assign({}, options.params)
    const route_key = Date.now() + ''

    // 每次 navigate 都需要重新定义 Current.page 的 setter，
    // 因为 setter 闭包捕获了本次调用的 route_key 和 route，
    // 后续导航必须使用自己的 route_key/route 来正确匹配 Promise
    Current['_page'] = Current.page
    Object.defineProperties(Current, {
      page: {
        set: function (page) {
          if (page === undefined || page === null) {
            this._page = page
            return
          }
          if (!page[ROUTE_KEY]) {
            const originOnUnload = page.onUnload
            page.onUnload = function () {
              originOnUnload && originOnUnload.apply(this)
              PageData.emitBack(route_key)
              setTimeout(() => execRouterBackListener(route))
            }
            page[ROUTE_KEY] = route_key
          }
          this._page = page
        },
        get: function () {
          return this._page
        },
      },
    })

    if (options.data) {
      PageData.setPageData(route_key, options.data)
    }

    const context = { route, type: options.type!, params: options.params, data: options.data }

    const middlewares = getMiddlewares(context)
    const url = formatPath(route, options!.params!)

    // 标记终端中间件是否实际执行了导航
    let navigated = false

    middlewares.push(async (ctx, next) => {
      navigated = true
      switch (options!.type) {
        case NavigateType.reLaunch:
          await Taro.reLaunch({
            url,
            complete: options?.complete,
            fail: options?.fail,
            success: options?.success,
          })
          break
        case NavigateType.redirectTo:
          await Taro.redirectTo({
            url,
            complete: options?.complete,
            fail: options?.fail,
            success: options?.success,
          })
          break
        case NavigateType.switchTab:
          await Taro.switchTab({
            url,
            complete: options?.complete,
            fail: options?.fail,
            success: options?.success,
          })
          // switchTab 的目标页面被微信缓存，onUnload 永不触发，
          // 因此 Taro API 调用完成后立即 resolve，不依赖页面生命周期
          PageData.emitBack(route_key)
          break
        default:
          await Taro.navigateTo({
            url,
            complete: options?.complete,
            fail: options?.fail,
            success: options?.success,
          })
          break
      }
      next()
    })

    return new Promise(async (res, rej) => {
      try {
        PageData.setPagePromise(route_key, { res, rej })
        await execMiddlewares(middlewares, context)

        // 中间件链执行完毕但终端中间件未执行（如被中间件拦截重定向），
        // 此时原始导航的 Promise 永远不会通过页面 onUnload 触发 emitBack，
        // 需要主动清理并 resolve，避免 Promise 泄漏
        if (!navigated) {
          PageData.cleanup(route_key)
          ;(res as (val: T | null) => void)(null)
        }
      } catch (err) {
        // 导航失败时清理 PageData，避免内存泄漏
        PageData.cleanup(route_key)
        rej(err)
      }
    })
  }

  /**
   * 返回上一个页面
   * @param result 返回给上一个页面的数据，如果 result 是 Error 的实例，则是抛出异常给上一个页面
   * @param options 其他选项
   */
  static back(
    result?: unknown,
    options?: {
      /** 返回的页面数，如果 delta 大于现有页面数，则返回到首页。 */
      delta?: number
    }
  ) {
    if (!isNil(result)) {
      PageData.setBackResult(result)
    }

    const currentPages = Taro.getCurrentPages()
    if (currentPages.length > 1) {
      return Taro.navigateBack(options)
    }

    throw new NoPageException()
  }

  /**
   * 设置页面返回的数据
   * 当物理键返回和左上角返回也需要带数据时会使用到
   */
  static setBackResult(result: any) {
    PageData.setBackResult(result)
  }

  /**
   * 获取上一个页面携带过来的数据
   * @param default_value 默认数据
   */
  static getData<T = any>(default_value?: T): T | undefined {
    return PageData.getPageData(default_value)
  }

  /** 获取上一个页面携带过来的参数 */
  static getParams<T = Partial<Record<string, string>>>(): T {
    const instance = getCurrentInstance()
    return Object.assign({}, instance.router?.params) as T
  }
}
