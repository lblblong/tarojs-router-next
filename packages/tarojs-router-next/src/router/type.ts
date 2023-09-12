export interface Route<E = any> {
  /** 页面 url，与配置在 app.config.ts 中的一致 */
  url: string
  /** 附加数据 */
  ext?: E
}

export enum NavigateType {
  /** 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Router.back 可以返回到原页面。小程序中页面栈最多十层。 */
  navigateTo = 'navigateTo',
  /** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。 */
  redirectTo = 'redirectTo',
  /** 关闭所有页面，打开到应用内的某个页面 */
  reLaunch = 'reLaunch',
  /** 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
  switchTab = 'switchTab',
}

export interface NavigateOptions {
  /** 跳转类型 */
  type?: NavigateType
  /** 跳转页面携带的数据，可以是任何类型 */
  data?: unknown
  /** 路由参数，将拼接在 url 后面，不适合携带大量数据，携带大量数据请使用 data */
  params?: Record<string, string | number | boolean | undefined>
  /** 路由参数，将拼接在 url 后面，不适合携带大量数据，携带大量数据请使用 data */
  complete?: (res: TaroGeneral.CallbackResult) => void
  /** 接口调用失败的回调函数 */
  fail?: (res: TaroGeneral.CallbackResult) => void
  /** 接口调用成功的回调函数 */
  success?: (res: TaroGeneral.CallbackResult) => void
}
