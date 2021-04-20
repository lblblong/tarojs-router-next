import { Middleware, RouteContext } from './type'

export { Middleware, RouteContext, MiddlewareCondition as MiddlewareHandler }

type MiddlewareCondition = (ctx: RouteContext) => boolean

export const middlewareCollection: {
  middlewares: Middleware[]
  condition?: MiddlewareCondition
}[] = []

export function registerMiddleware(middleware: Middleware, condition?: MiddlewareCondition) {
  middlewareCollection.push({
    middlewares: [middleware],
    condition,
  })
}

export function registerMiddlewares(middlewares: Middleware[], condition?: MiddlewareCondition) {
  middlewareCollection.push({
    middlewares,
    condition,
  })
}

export function getMiddlewares(ctx: RouteContext) {
  return middlewareCollection
    .filter((mc) => {
      if (!mc.condition) return true
      else return mc.condition(ctx)
    })
    .map((mc) => mc.middlewares)
    .reduce((pre, cur) => {
      return [...pre, ...cur]
    }, [])
}
