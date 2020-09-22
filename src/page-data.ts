import { getCurrentRouteKey } from "./utils"

/** @internal */
export class PageData {
  static _pageData: Map<string, any> = new Map()
  static _pagePromise: Map<
    string,
    {
      res: (val: any) => void
      rej: (err: any) => void
    }
  > = new Map()
  static _backErr: Map<string, any> = new Map()
  static _backData: Map<string, any> = new Map()

  static getPageData<T = any>(default_data?: T): T {
    let route_key = getCurrentRouteKey()
    let result = PageData._pageData.get(route_key) || default_data
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
    let err = PageData._backErr.get(route_key)
    let data = PageData._backData.get(route_key)

    PageData.delPageData()
    PageData.delPagePromise()

    if (err) {
      PageData._backErr.delete(route_key)
      pme.rej(err)
    } else if (data) {
      PageData._backData.delete(route_key)
      pme.res(data)
    } else {
      pme.res(null)
    }
  }

  static setBackData(data?: any) {
    let route_key = getCurrentRouteKey()
    PageData._backData.set(route_key, data)
  }

  static setBackError(err: any) {
    let route_key = getCurrentRouteKey()
    PageData._backErr.set(route_key, err)
  }

}
