

export interface IRoute<E = any> {
  /** 页面 url，与配置在 app.config.ts 中的一致 */
  url: string
  /** 附加数据 */
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
  /** 效果与 Taro.redirectTo 一致 */
  replace?: boolean
  /** 效果与 Taro.reLaunch 一致*/
  reLaunch?: boolean
  /** 跳转页面携带的数据，可以是任何类型，到目标页面后使用 useRouter 或 Router.getData 获取 */
  data?: any
  /** 路由参数，仅支持 object 类型，不适合携带大量数据，携带大量数据请使用 data */
  params?: object
}