# registerMiddleware

注册路由中间件，注册的中间件按照注册顺序执行

方法定义：

`registerMiddleware(middleware: Middleware, condition?: MiddlewareCondition): void`

参数：

1. `middleware` 中间件，`Middleware` 类型
2. `condition` 注册条件，`(ctx: RouteContext): boolean` 类型

## 注册路由中间件

```typescript
import Taro from '@tarojs/taro'
import { Middleware, registerMiddleware } from 'tarojs-router-next'

// 定义路由中间件
export const Logger: Middleware = async (ctx, next) => {
  console.log('中间件开始执行，当前进入的路由：', ctx.route.url)
  await next() // 执行下一个中间件
  console.log(' 中间件结束执行 ')
}

// 注册路由中间件
registerMiddleware(Logger)
```

## 动态注册路由中间件

```typescript
// 仅为 me 和 home 页面注册该路由中间件
registerMiddleware(Logger, (ctx) => {
  return ['/pages/me/index', '/pages/home/index'].indexOf(ctx.route.url) !== -1
})
```

## 获取路由的附带数据

路由的附加数据可以在 [route.config.ts](/guide/quike/route-config) 配置，当直接使用 [Router.navigate](/api/class/router#navigate-route-options-) 方法时则通过参数 [route.ext](/guide/quike/route-config#导出附加数据-ext) 传递给中间件

一个检查必须登录的路由中间件示例：

```typescript
import Taro from '@tarojs/taro'
import { hasLogin, login } from '@/store/user'
import { Middleware, registerMiddleware } from 'tarojs-router-next'

export const LoginCheckMiddleware: Middleware<{ mustLogin: string }> = async (ctx, next) => {
  const { mustLogin } = ctx.route.ext // 附加数据
  if (mustLogin && !hasLogin) {
    await login()
  }
  await next()
}
```
