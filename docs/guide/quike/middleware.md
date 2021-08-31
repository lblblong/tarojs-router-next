---
title: 路由中间件
order: 6
group:
  title: 快速开始
---

# 路由中间件

路由中间件将在跳转到目标页面之前执行，中间件的执行流程参考 koa 的洋葱模型：

![](/tarojs-router-next/images/koa.png)

koa 是一个后端框架，在 koa 中，用户发起一个 http 请求给 koa 启动的服务，请求一层层进入 koa 的中间件，最终进入到一段 `具体的逻辑`（数据库操作或其他），然后再原路返回一段响应给用户。

换到这里就是，用户发起一个请求（进入页面的请求，包含目标页面的 url，ext 数据），请求一层层进入注册的中间件，然后进入到最后一个中间件：`跳转到目标页面的中间件`。然后再原路返回。

## 跳转到目标页面的中间件

在 tarojs-router-next 的路由跳转中，有一个隐藏的中间件：`跳转到目标页面的中间件`，它会默认添加在当前路由要执行的中间件的最后一个 `[...你的中间件, 跳转到目标页面的中间件]`，它即代表了 `目标页面`。

## 通过一个示例理解

注册几个路由中间件

```typescript
import Taro from '@tarojs/taro'
import { Middleware, registerMiddlewares } from 'tarojs-router-next'

export const M1: Middleware = async (ctx, next) => {
  console.log('第一个中间件执行：', ctx.route.url)
  await next() // 执行下一个中间件
}

export const M2: Middleware = async (ctx, next) => {
  console.log('第二个中间件执行：', ctx.route.url)
  await next() // 执行下一个中间件
}

export const M3: Middleware = async (ctx, next) => {
  console.log('第三个中间件执行：', ctx.route.url)
  await next() // 执行下一个中间件
}

// 注册路由中间件
registerMiddlewares([M1, M2, M3])

// 其实会执行四个中间件 [M1, M2, M3, 跳转到目标页面的中间件]
```

然后在 `/pages/home/index` 页进行跳转到 `/pages/me/index` 页面

```typescript
// pages/home/index.tsx
import { Router } from 'tarojs-router-next'
Router.toMe() // 进行页面跳转
```

在 `/pages/me/index` 页面打印内容

```typescript
// pages/me/index.tsx
export default function Page() {
  console.log('成功进入了页面：me')
  return <View></View>
}
```

输出：

```shell
第一个中间件执行：/pages/me/index
第二个中间件执行：/pages/me/index
第三个中间件执行：/pages/me/index
成功进入了页面：me
```

现在我们想要在第二个中间件中判断用户是否登录，如果未登录就不要进入 me 页面，则只需要进行一些判断即可：

```typescript
export const M2: Middleware = async (ctx, next) => {
  console.log('第二个中间件执行：', ctx.route.url)
  if (hasLogin()) {
    await next() // 执行下一个中间件
  } else {
    // 只要不执行 next，不进入后面的中间件即可
    console.log('请登录')
  }
}
```

## 注册路由中间件

上面的例子中我们注册了三个中间件，用的是 [registerMiddlewares](/api/method/register-middlewares)，注册单个中间件可以使用 [registerMiddleware](/api/method/register-middleware)

```typescript
import Taro from '@tarojs/taro'
import { Middleware, registerMiddleware } from 'tarojs-router-next'

export const M1: Middleware = async (ctx, next) => {
  console.log('中间件执行：', ctx.route.url)
  await next()
  console.log('中间件执行结束')
}

registerMiddleware(M1)
```

## 动态注册路由中间件

有的时候我们希望某个中间件只为特定的页面工作，这个需求可以在中间件中增加判断条件来实现，但在中间件中做这些判断会使中间件的职能不够专一，并且这些判断逻辑无法在多个中间件中复用

怎么解决呢，我们可以在注册中间件时传递一个方法，将本来要写到中间件中的判断逻辑抽取到该方法中。在路由进入时该方法会被调用并传入当前路由的上下文，若方法返回 `true` 则为当前路由执行这些中间件

```typescript
// 仅为 me 和 home 页面注册该路由中间件
registerMiddleware(Logger, (ctx) => {
  return ['/pages/me/index', '/pages/home/index'].indexOf(ctx.route.url) !== -1
})

// 注册多个中间件
registerMiddlewares([Logger, Auth], (ctx) => {
  return ['/pages/me/index', '/pages/home/index'].indexOf(ctx.route.url) !== -1
})
```

## 路由附加数据

vue 开发者一定知道，我们使用 vue-router 定义路由时可以通过 [路由元信息](https://router.vuejs.org/zh/guide/advanced/meta.html) 携带一些数据告知导航守卫对该路由做一些特殊的处理:

比如告诉导航守卫该页面是要登陆的

```typescript
const router = new VueRouter({
  routes: [
    {
      path: '/me',
      ...
      meta: { mustLogin: true }
    }
  ]
})
```

或者是某些权限才可以访问，

```typescript
{
  ...
  meta: { roles: [1, 2, 3] }
}
```

然后我们就可以在导航守卫中获取到 `meta` 和 `route` 来进行一些判断和处理

#### 在 tarojs-router-next 中这样实现：

首先，我们要定义附加数据，在页面文件夹下面新建 [route.config.ts](/guide/quike/route-config) 文件，然后导出 [Ext](/guide/quike/route-config#导出附加数据-ext)：

![](/tarojs-router-next/images/code3.png)

然后就可以在中间件中访问并使用：

```typescript
import Taro from '@tarojs/taro'
import { Middleware, Router } from 'tarojs-router-next'

export const AuthCheck: Middleware<{ mustLogin: boolean }> = async (ctx, next) => {
  if (ctx.route.ext?.mustLogin) {
    const token = Taro.getStorageSync('token')
    if (!token) {
      const { confirm } = await Taro.showModal({
        title: '提示',
        content: '请先登录',
      })

      if (confirm) Router.toLogin()

      // 直接返回，不执行 next 即可打断中间件向下执行
      return
    }
  }

  await next()
}
```

但是请注意的是，通过 [route.config.ts](/guide/quike/route-config) 这种方式定义的附加数据，只有通过 [Router.to\*\*](/api/class/router#to-options-) 跳转时才会携带，通过 [Router.navigate](/api/class/router#navigate-route-options-) 跳转时，请通过 route.ext 参数携带

```typescript
import { Router } from 'tarojs-router-next'
Router.navigate({ url: '/pages/article-detail/index', ext: { mustLogin: true } })
```
