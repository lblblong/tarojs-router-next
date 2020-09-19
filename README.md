## 文档
[tarojs-router 文档](https://www.yuque.com/lblblong/rgfig4/ggr8bh)
[API 文档](https://lblblong.github.io/tarojs-router/)

## 示例

[Demo（代码）](https://github.com/lblblong/tarojs-router/tree/master/example)
[Demo（微信开发者工具打开）](https://developers.weixin.qq.com/s/S1fXKsmq7dkK)

## 解决开发中的痛点

#### 一、页面传参

```typescript
// ✘ 手动拼接路径，无法传任意类型，数据量有限制
Taro.navigateTo({
  url: '/pages/user/index?name=李四&id=1',
})

// ✔ tarojs-router 自动拼接，可传任意类型任意大小的数据
Router.navigate(
  { url: '/pages/user/index' },
  {
    // url 参数，自动拼接
    params: { id: 1, name: '李四' },
    // 可携带其他数据，任意类型
    data: [1, 2, 3, 4],
  }
)

// 目标页面获取数据，函数组件：
const { params, data } = useRouter()
// 目标页面获取数据，Class 组件：
const data = Router.getData()
const params = getCurrentInstance().router?.params
```

#### 二、跳页面取值

```typescript
// ✘ 简单做法是跳转过去后把选中的值全局存储起来，回到页面后再去取，自己实现这个过程比较麻烦

// ✔ tarojs-router 封装了这个过程，直接使用
const cityData = await Router.navigate({ url: '/pages/sel-city/index' })
console.log(cityData?.cityName)

// src/pages/sel-city/index.tsx
const { backData } = useRouter()
backData({ cityName: '深圳', adcode: 'xxxx' })
```

#### 三、路由中间件（附加功能）

```typescript
// tarojs-router 提供和 koa 一致的路由中间件功能

// 实现一个登录检查的路由中间件
// auth-check.ts
export const AuthCheck: IMiddlware<{ mustLogin: boolean }> = async (ctx, next) => {
  if (ctx.route.ext?.mustLogin) {
    const token = Taro.getStorageSync('token')
    if (!token) {
      const { confirm } = await Taro.showModal({
        title: '提示',
        content: '请先登录',
      })
      if (confirm) toLogin()
      throw Error('该页面必须要登陆：' + ctx.route.url)
    }
  }
  await next()
}

// router.ts
Router.config({
  middlewares: [AuthCheck],
})

// ext 携带 mustLogin 并且为 true 则会检查 token，token 不存在则跳转登录
Router.navigate({ url: '/pages/home/index', ext: { mustLogin: true } })
```
