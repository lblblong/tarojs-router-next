
## 说明
该项目是原 [tarojs-router](https://www.npmjs.com/package/tarojs-router) 

## 文档
[快速开始](https://www.yuque.com/lblblong/rgfig4/ksuuhi)

#### 安装
```bash
npm install tarojs-router-next
# or
yarn add tarojs-router-next
```

## 示例

[React Demo（代码）](https://github.com/lblblong/tarojs-router-next/tree/master/examples/react)
[Vue3 Demo（代码）](https://github.com/lblblong/tarojs-router-next/tree/master/examples/vue)
[Demo（微信开发者工具打开）](https://developers.weixin.qq.com/s/3Zts2wmU7Ok0)


## 前言
最近用Taro开发小程序发现一些不好用的地方：
- 页面传参需要手动拼接 url
- 页面传参无法携带大量任意类型数据
- 跳页面取值比较麻烦（比如填写表单跳页面选择城市，往往需要全局存储，回到页面再去取，也可以通过event，但是总要写很多代码）


为了实现上面的需求更方便，于是封装了一下：[tarojs-router-next](https://www.npmjs.com/package/tarojs-router-next)



## 看看 tarojs-router-next 如何解决上面的问题

#### 一、页面传参

```typescript
// ✘ 手动拼接路径，无法传任意类型，数据量有限制
Taro.navigateTo({
  url: '/pages/user/index?name=李四&id=1',
})

// ✔ tarojs-router-next 自动拼接，可传任意类型任意大小的数据
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
实现这种需求，简单做法是跳转过去后把选中的值全局存储起来，回到页面后再去取，自己实现这个过程比较麻烦

熟悉flutter的可能知道
```dart
// 跳转到目标页面
final cityData = await Navigator.push(...)

// 返回值到上一个页面
Navigator.pop({cityName: '深圳', adcode: 'xxxx'})
```

tarojs-router-next 中写法基本一致，内部通过 promise 实现

```typescript
// ✔ tarojs-router-next 封装了这个过程，直接使用
const cityData = await Router.navigate({ url: '/pages/sel-city/index' })
console.log(cityData?.cityName)

// src/pages/sel-city/index.tsx
const { backData } = useRouter()
backData({ cityName: '深圳', adcode: 'xxxx' })
```

#### 三、路由中间件
tarojs-router-next 提供和 koa 一致的路由中间件功能
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cbad684af27455cb4a297f0e3e64a92~tplv-k3u1fbpfcp-zoom-1.image)

```typescript
// 实现一个登录检查的路由中间件
// auth-check.ts
export const AuthCheck: IMiddleware<{ mustLogin: boolean }> = async (ctx, next) => {
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

##### 单个页面路由中间件
有的时候只有部分页面需要做一些处理，则可以定义单页面路由中间件，使用方式如下
```typescript
Router.navigate({ url: '/pages/home/index', beforeRouteEnter: [AuthCheck], ext: { mustLogin: true } })
```
