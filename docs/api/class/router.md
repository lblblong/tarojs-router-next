---
title: Router
group:
  order: 1
  title: 类
---

# Router

`Router` 类是 tarojs-router-next 的核心，该类提供各种导航的静态方法，以及获取路由参数的方法。

默认情况下 tarojs-router-next 会监听扫描 `src/pages` 下的文件变化自动为 `Router` 类生成 `to` 开头的静态路由方法，避免使用者手动编写导航方法。

## getParams( )

获取上一个页面传递过来的路由参数

## getData( default_value? )

获取上一个页面传递过来的数据

参数：

1. `default_value` 默认值，`any` 类型，当没有传入数据时返回这个默认值

## to\*\*( options )

以 to 开头的方法都是根据项目的 `src/pages` 下的文件夹和 [route.config.ts](/guide/quike/route-config) 文件自动生成的，比如 `src/pages/me` 文件夹会为 `Router` 类生成静态方法 `Router.toMe`

```typescript
import { Router, NavigateType } from 'tarojs-router-next'

// 跳转到 /pages/me/index 页面
Router.toMe()
// 重定向到 /pages/me/index 页面
Router.toMe({ type: NavigateType.redirectTo })
// 跳转到 /pages/login/index 页面并传递参数
Router.toLogin({ params: { username: 'taro' } })
// 跳转到 /pages/article-edit/index 页面并传递数据
Router.toArticleEdit({ data: { title: 'taro', content: '小程序框架' } })
```

参数：

1. `options` 跳转选项
   - `options.params` 传递参数，默认 `{ [key: string]: string | number | boolean | undefined  }` 类型，可以通过页面下 [route.config.ts](/guide/quike/route-config) 配置类型
   - `options.data` 传递数据，默认 `any` 类型，可以通过页面下 [route.config.ts](/guide/quike/route-config) 配置类型
   - `options.type` 跳转类型，[NavigateType](/api/other#navigatetype) 类型

## navigate( route, options? )

导航到应用内的某个页面，一般不会直接使用，因为 tarojs-router-next 默认会为应用的每个页面生成对应的 to\*\* 的跳转方法。

```typescript
import { Router, NavigateType } from 'tarojs-router-next'

// 不带参跳转
Router.navigate({ url: '/pages/login/index' })
// 带参跳转
Router.navigate({ url: '/pages/login/index' }, { params: { username: 'router' } })
// 关闭当前页面，重定向到 login 页面
Router.navigate({ url: '/pages/login/index' }, { type: NavigateType.redirectTo })
```

参数：

1. `route` 目标页面选项
   - `route.url` 目标页面的 url ，`string` 类型
   - `route.ext` 附加数据，该数据是给路由中间件访问的，类似 vue-router 的 [路由元信息](https://router.vuejs.org/zh/guide/advanced/meta.html)
2. `options` 跳转选项
   - `options.params` 传递参数，`{ [key: string]: string | number | boolean | undefined  }` 类型
   - `options.data` 传递数据，`any` 类型
   - `options.type` 跳转类型，[NavigateType](/api/other#navigatetype) 类型

## back( result? )

返回到上一个页面

该方法可以返回数据到前一个页面，也可抛出异常到前一个页面

```typescript
Router.back() // 返回上一个页面，此时上一个页面拿到的是 null
Router.back({ id: 1, name: '深圳' }) // 返回上一个页面并返回城市数据
Router.back(new Error('用户取消选择')) // 返回上一个页面并抛出异常
```

而在上一个页面获取返回的数据只需要 `await` 即可

```typescript
try {
  const result = await Router.navigate({ url: '/pages/sel-city/index' })
  console.log('选择城市：', result)
} catch ( err ) {
  console.log( err.message )
}
```

参数：

1. `result` 返回的数据，可以为任意类型，但当 `result` 是 `Error` 的实例时，则是往上一个页面抛出异常
