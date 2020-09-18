
import { Router } from "./router"
import { getCurrentRoute } from "./utils"

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
    let route = getCurrentRoute()
    let result = PageData._pageData.get(route as string) || default_data
    return result
  }

  static delPageData() {
    let route = getCurrentRoute()
    PageData._pageData.delete(route as string)
  }

  static getPagePromise() {
    let route = getCurrentRoute()
    return PageData._pagePromise.get(route as string)
  }

  static delPagePromise() {
    let route = getCurrentRoute()
    PageData._pagePromise.delete(route as string)
  }

  static setPageData(router_url: string, data: any) {
    this._pageData.set(router_url, data)
  }

  static setPagePromise(
    router_url: string,
    options: {
      res: (val: any) => void
      rej: (err: any) => void
    }
  ) {
    this._pagePromise.set(router_url, options)
  }

  static emitBack() {
    const pme = PageData.getPagePromise()
    if (!pme) return
    let route = getCurrentRoute() as string
    let err = PageData._backErr.get(route)
    let data = PageData._backData.get(route)

    PageData.delPageData()
    PageData.delPagePromise()

    if (err) {
      PageData._backErr.delete(route)
      pme.rej(err)
    } else if (data) {
      PageData._backData.delete(route)
      pme.res(data)
    } else {
      pme.res(null)
    }
  }

  static setBackData(data?: any) {
    let route = getCurrentRoute()
    PageData._backData.set(route as string, data)
  }

  static setBackError(err: any) {
    let route = getCurrentRoute()
    PageData._backErr.set(route as string, err)
  }

  static backData(data?: any, url?: string) {
    PageData.setBackData(data)
    Router.back(url)
  }

  static backError(err: any, url?: string) {
    PageData.setBackError(err)
    Router.back(url)
  }
}
