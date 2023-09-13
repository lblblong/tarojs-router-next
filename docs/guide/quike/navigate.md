# 路由跳转

在项目启动后，tarojs-router-next 会自动监听项目下 `src/pages` 的变动，为 [Router](/api/router) 类生成对应的路由方法，路由方法名字以 [to](/api/router#to-options-) 起头。

如以下左边页面结构会为 [Router](/api/router) 生成的路由方法：

![](/tarojs-router-next/images/code1.png)

```typescript
import { Router, NavigateType } from 'tarojs-router-next'

Router.toLogin()  // 不带参跳转
Router.toLogin({ params: { username: 'router' })  // 带参跳转
Router.toLogin({ type: NavigateType.redirectTo }) // 关闭当前页面，重定向到 login 页面

```

以上是自动生成的 [Router.to\*\*](/api/router#to-options-) 方法，具体参考 API 文档：[Router.to\*\*(options)](/api/router#to-options-)

如果没有使用路由方法自动生成插件，还可以通过 [Router.navigate](/api/router#navigate-route-options-) 方法进行路由跳转

```typescript
import { Router, NavigateType } from 'tarojs-router-next'

// 不带参跳转
Router.navigate({ url: '/pages/login/index' })
// 带参跳转
Router.navigate({ url: '/pages/login/index' }, { params: { username: 'router' } })
// 关闭当前页面，重定向到 login 页面
Router.navigate({ url: '/pages/login/index' }, { type: NavigateType.redirectTo })
```

跳转类型参考：[NavigateType](/api/other#navigatetype)

## 页面返回

tarojs-router-next 提供了 [Router.back](/api/router#back-result-) 方法以供页面返回

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
} catch (err) {
  console.log(err.message)
}
```
