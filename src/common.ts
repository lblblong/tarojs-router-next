export const ROUTE_KEY = 'route_key'

export interface IRoute<E = any> {
  /** 页面 url，与配置在 app.config.ts 中的一致 */
  url: string
  /** 附加数据 */
  ext?: E
  /** 进入路由前的路由中间件 */
  beforeRouteEnter?: IMiddlware
}

export interface RouteContext<E = any> {
  /** 目标路由 */
  route: IRoute<E>
  /** 路由参数 */
  params: any
}

export type IMiddlware<E = any> = (ctx: RouteContext<E>, next: () => Promise<any>) => Promise<void>

export interface RouterConfig {
  /** 调用 back 退无可退时返回的页面 */
  rootPath?: string
  /** 路由中间件（洋葱模型），参考 koa */
  middlewares?: IMiddlware[]
}

export enum NavigateType {
  /** 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Router.back 可以返回到原页面。小程序中页面栈最多十层。 */
  navigateTo,
  /** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。 */
  redirectTo,
  /** 关闭所有页面，打开到应用内的某个页面 */
  reLaunch,
  /** 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
  switchTab,
}

export interface NavigateOptions {
  /** 跳转类型 */
  type?: NavigateType
  /** 跳转页面携带的数据，可以是任何类型，到目标页面后使用 useRouter 或 Router.getData 获取 */
  data?: any
  /** 路由参数，仅支持 object 类型，不适合携带大量数据，携带大量数据请使用 data */
  params?: object
}
