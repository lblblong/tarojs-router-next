---
title: registerMiddlewares
order: 2
group:
  order: 2
  title: 方法
---

# registerMiddlewares

注册多个路由中间件，注册的中间件按照注册顺序执行

方法定义：

`registerMiddlewares(middlewares: Middleware[], condition?: MiddlewareCondition): void`

参数：

1. `middlewares` 中间件，`Middleware` 类型
2. `condition` 注册条件，`(ctx: RouteContext): boolean` 类型


使用方法参考 [registerMiddleware](/api/method/register-middleware)