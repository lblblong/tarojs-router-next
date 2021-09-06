import Taro, { Current, getCurrentInstance } from '@tarojs/taro'
import { ROUTE_KEY } from '../constants'
import { NoPageException } from '../exception/no-page'
import { compose } from '../lib/compose'
import { getMiddlewares } from '../middleware'
import { PageData } from '../page-data'
import { formatPath } from '../util'
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
    middlewares.push(async (ctx, next) => {
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
      next()
    })

    return new Promise(async (res, rej) => {
      PageData.setPagePromise(route_key, { res, rej })

      const fn = compose(middlewares)
      await fn(context)
    })
  }

  /**
   * 返回上一个页面
   * @param result 返回给上一个页面的数据，如果 result 是 Error 的实例，则是抛出异常给上一个页面
   */
  static back(result?: any) {
    if (result) {
      PageData.setBackResult(result)
    }

    const currentPages = Taro.getCurrentPages()
    if (currentPages.length > 1) {
      return Taro.navigateBack()
    }

    throw new NoPageException()
  }

  /**
   * 获取上一个页面携带过来的数据
   * @param default_value 默认数据
   */
  static getData<T = any>(default_value?: T): T | undefined {
    return PageData.getPageData(default_value)
  }

  /** 获取上一个页面携带过来的参数 */
  static getParams() {
    const instance = getCurrentInstance()
    return Object.assign({}, instance.router?.params)
  }
}
