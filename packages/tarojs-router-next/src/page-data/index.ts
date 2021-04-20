import { getCurrentRouteKey } from '../util'

export class PageData {
  static _pageData: Map<string, any> = new Map()
  static _pagePromise: Map<
    string,
    {
      res: (val: any) => void
      rej: (err: any) => void
    }
  > = new Map()

  static _backResult: Map<string, any> = new Map()

  static getPageData<T = any>(default_value?: T): T {
    let route_key = getCurrentRouteKey()
    let result = PageData._pageData.get(route_key) || default_value
    return result
  }

  static delPageData() {
    let route_key = getCurrentRouteKey()
    PageData._pageData.delete(route_key)
  }

  static getPagePromise() {
    let route_key = getCurrentRouteKey()
    return PageData._pagePromise.get(route_key)
  }

  static delPagePromise() {
    let route_key = getCurrentRouteKey()
    PageData._pagePromise.delete(route_key)
  }

  static setPageData(route_key: string, data: any) {
    this._pageData.set(route_key, data)
  }

  static setPagePromise(
    route_key: string,
    options: {
      res: (val: any) => void
      rej: (err: any) => void
    }
  ) {
    this._pagePromise.set(route_key, options)
  }

  static emitBack() {
    const pme = PageData.getPagePromise()
    if (!pme) return
    let route_key = getCurrentRouteKey()
    let result = PageData._backResult.get(route_key)

    PageData.delPageData()
    PageData.delPagePromise()

    if (result) {
      PageData._backResult.delete(route_key)
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
    PageData._backResult.set(route_key, result)
  }
}
