

export interface IRoute<E = any> {
  url: string
  ext?: E
}

export interface RouteContext<E = any> {
  route: IRoute<E>
}

export type IMiddlware<E = any> = (ctx: RouteContext<E>, next: () => Promise<any>) => Promise<void>

export interface RouterConfig {
  /** 调用 back 退无可退时返回的页面 */
  rootPath?: string
  /** 路由中间件（洋葱模型），参考 koa */
  middlewares?: IMiddlware[]
}


export interface NavigateOptions {
  /** Taro.redirectTo */
  replace?: boolean
  /** Taro.reLaunch */
  reLaunch?: boolean
  /** 跳转页面携带的数据，可以是任何类型，到目标页面后使用 useRouter 或 Router.getData 获取 */
  data?: any
  /** 路由参数，仅支持 object 类型，不适合携带大量数据，携带大量数据请使用 data */
  params?: object
}