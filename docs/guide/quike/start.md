# 安装及使用

## 安装核心依赖

```shell
$ npm install --save tarojs-router-next
```

## 安装路由方法自动生成插件

```shell
$ npm install --dev tarojs-router-next-plugin
```

在 [编译配置(/config/index.js)](https://taro-docs.jd.com/taro/docs/config-detail/#plugins) 的 plugins 字段中引入插件：

```typescript
const config = {
  plugins: ['tarojs-router-next-plugin'],
}
```

如果要关闭自动生成 [Router.to\*\*](/api/class/router#to-options-) 相关的路由方法，需要修改配置项 `watch` 为 `false`，请参考 [关闭自动生成 Router.to\*\*](/guide/quike/config#关闭自动生成-routerto)

## 开始使用

#### 路由跳转

在启动项目后，tarojs-router-next 会自动监听项目下 `src/pages` 的变动，自动为 [Router](/api/class/router) 类生成对应的路由方法，路由跳转方法名字以 [to](/api/class/router#to-options-) 起头。如以下左边页面结构会为 [Router](/api/class/router) 生成的路由方法：

![](/tarojs-router-next/images/code1.png)

如果关闭了路由方法的自动生成，还可以通过 [Router.navigate](/api/class/router#navigate-route-options-) 方法进行路由跳转

查看关于路由跳转的更多信息：[路由跳转](/guide/quike/navigate)

#### 页面传参

可以通过方法的 `params` 和 `data` 选项传递数据：

```typescript
// 传递参数，params 会展开拼接在 url 后面
Router.toDetail({ params: { id: 1 } })
Router.toDetail({ params: { id: 1, name: 'lbl' } })

Router.navigate({ url: '/pages/detail/index' }, { params: { id: 1 } })
Router.navigate({ url: '/pages/detail/index' }, { params: { id: 1, name: 'lbl' } })

// 传递数据，可传递任意类型和大小的数据
Router.toDetail({ data: { name: 'taro', role: [1, 2, 3] } })
Router.toDetail({ data: 123 })
Router.toDetail({ data: true })

// 同时传递
Router.toDetail({ params: { id: 1 }, data: 123 })
```

查看关于路由传参的更多信息：[路由传参](/guide/quike/params)
