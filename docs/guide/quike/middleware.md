---
title: 路由中间件
order: 5
group:
  title: 快速开始
---

# 路由中间件

路由中间件将在跳转到目标页面之前执行，中间件的执行流程参考 koa 的洋葱模型：

![](/images/koa.png)

koa 是一个 web 后端框架，用户发起一个 http 请求给 koa 启动的服务，请求一层层进入 koa 的中间件，变成响应后再一层层出来丢给用户的客户端（app、浏览器）

换到这里就是，用户发起一个请求（进入页面的请求，包含目标页面的 url，ext 数据），请求一层层进入注册的中间件，然后再一层层的出来最终进入到目标页面

## 通过一个示例理解

注册几个路由中间件

```typescript
import Taro from '@tarojs/taro'
import { Middleware, registerMiddleware } from 'tarojs-router-next'

export const M1: Middleware = async (ctx, next) => {
  console.log('第一个中间件执行：', ctx.route.url)
  await next() // 执行下一个中间件
  console.log('第一个中间件执行结束')
}

export const M2: Middleware = async (ctx, next) => {
  console.log('第二个中间件执行：', ctx.route.url)
  await next() // 执行下一个中间件
  console.log('第二个中间件执行结束')
}

export const M3: Middleware = async (ctx, next) => {
  console.log('第三个中间件执行：', ctx.route.url)
  await next() // 执行下一个中间件
  console.log('第三个中间件执行结束')
}

// 注册路由中间件
registerMiddlewares([M1, M2, M3])
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
第三个中间件执行结束
第二个中间件执行结束
第一个中间件执行结束
成功进入了页面：me
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

![](/images/code3.png)

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

      // 打断路由执行
      throw Error('该页面必须要登陆：' + ctx.route.url)
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
