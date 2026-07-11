import { getCurrentRouteKey } from '../func'

export class PageData {
  private static pageData: Map<string, any> = new Map()
  private static pagePromise: Map<
    string,
    {
      res: (val: any) => void
      rej: (err: any) => void
    }
  > = new Map()

  private static backResult: Map<string, any> = new Map()

  static getPageData<T = any>(default_value?: T): T {
    let route_key = getCurrentRouteKey()
    let result = PageData.pageData.get(route_key) || default_value
    return result
  }

  static setPageData(route_key: string, data: any) {
    this.pageData.set(route_key, data)
  }

  static setPagePromise(
    route_key: string,
    options: {
      res: (val: any) => void
      rej: (err: any) => void
    }
  ) {
    this.pagePromise.set(route_key, options)
  }

  /** 清理指定 route_key 的所有数据，避免内存泄漏 */
  static cleanup(route_key: string) {
    PageData.pageData.delete(route_key)
    PageData.pagePromise.delete(route_key)
    PageData.backResult.delete(route_key)
  }

  static emitBack(route_key: string) {
    const pme = PageData.pagePromise.get(route_key)
    if (!pme) return
    const result = PageData.backResult.get(route_key)

    PageData.cleanup(route_key)

    if (result) {
      if (result instanceof Error) {
        pme.rej(result)
      } else {
        pme.res(result)
      }
    } else {
      pme.res(null)
    }
  }

  static setBackResult(result: any) {
    const route_key = getCurrentRouteKey()
    PageData.backResult.set(route_key, result)
  }
}
