import { Route } from '../router/type'

export interface RouteContext<E = any> {
  /** 目标路由 */
  route: Route<E>
  /** 路由参数 */
  params: any
}

export type Middleware<E = any> = (ctx: RouteContext<E>, next: () => Promise<any>) => Promise<void>
