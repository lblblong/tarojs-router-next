# 路由传参

区别于小程序的路由传参方式，tarojs-router-next 不需要在 `url` 后面手动拼接路由参数，并且还可以传递任意类型、任意大小的数据。

## 使用示例

#### 传递 params

`params` 会由 tarojs-router-next 展开并拼接在 `url` 后面，所以只能传递少量并且是 `Record<string, string | number | boolean>` 类型的数据

请不要通过 `params` 传递层级大于一层的数据，层级大于一层的数据请使用 [data](/guide/quike/params#传递-data)

```typescript
// 可以传递
Router.toDetail({ params: { id: 1 } })
Router.toDetail({ params: { id: 1, name: 'lbl' } })

Router.navigate({ url: '/pages/detail/index' }, { params: { id: 1 } })
Router.navigate({ url: '/pages/detail/index' }, { params: { id: 1, name: 'lbl' } })

// 以下是错误使用方式
Router.toDetail({ params: { obj: { id: 1 } } }) // 不可以传递层级大于 1 的数据
Router.toDetail({ params: 1 }) // 必须是  Record<string, string | number | boolean> 类型的数据
```

#### 传递 data

`data` 可以传递任意类型任意大小的数据

```typescript
Router.toDetail({ data: { name: 'taro', role: [1, 2, 3] } })
Router.toDetail({ data: 123 })
Router.toDetail({ data: true })

Router.toDetail({ url: '/pages/detail/index' }, { data: { name: 'taro', role: [1, 2, 3] } })
Router.toDetail({ url: '/pages/detail/index' }, { data: 123 })
Router.toDetail({ url: '/pages/detail/index' }, { data: true })
```

## 类型提示

页面的入参可能会经常变动，如果没有类型提示，我们经常会忘了哪里的传参没有同步修改

使用 tarojs-router-next 可以通过页面下的 [route.config.ts](/guide/quike/route-config) 定义 [params](/guide/quike/route-config#定义进入该页面需要传入的-params-参数的类型) 和 [data](/guide/quike/route-config#定义进入该页面需要传入的-data-数据的类型) 的类型：

在页面文件夹下创建 `route.config.ts` 文件

- src/pages/detail
  - index.config.ts
  - index.tsx
  - `route.config.ts`

导出 `Data` 和 `Params` 的类型：

```typescript
// 导出 params 的类型，名字必须是 Params
export type Params = {
  id: number
  name: string
}

// 导出 data 的类型，名字必须是 Data
export type Data = {
  users: {
    id: number
    name: string
  }[]
}
```

然后 tarojs-router-next 就会生成带有类型提示的跳转方法
