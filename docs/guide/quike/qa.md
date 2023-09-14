# 常见问题

## 没有生成路由方法？

**是否正确安装？**

请参考 [安装及使用](/guide/quike/start)

**主包页面是否在 `src/pages` 目录下？**

如果不在 `src/pages` 下则需要按照 [主包页面不在 src/pages 目录下](/guide/quike/subpackage#主包页面不在-srcpages-目录下) 进行配置

**是否配置分包**

请参考 [分包支持](/guide/quike/subpackage)

## 生成的路由方法跳转的路径是错误的

请检查页面文件名是否是 `index`，比如： `index.tsx / index.jsx / index.vue`

```typescript
export default {
  pages: [
    'pages/user/index', // 支持
    'pages/user/setting/index', // 不支持，非 pages 一级目录下
    'pages/user/user',  // 不支持，页面文件名不是 index
  ],
  subpackages: [
    {
      root: 'packageA',
      pages: [
        'pages/cat/index', // 支持
        'pages/animal/dog/index'  // 不支持，非 packageA/pages 一级目录下
        'pages/cat/cat'  // 不支持，页面文件名不是 index
      ],
    }
  ],
}

```

## 开发模式下提示 toXXX 方法不存在

Taro 3.5 及以上版本需要将 tarojs-router-next 从预编译中移除，否则后续的代码生成不会热更新到运行中的代码里。

请在 [编译配置(config/index.js)](https://taro-docs.jd.com/docs/config-detail#compilerprebundleexclude) 中将 tarojs-router-next 从预编译中排除：

```typescript
const config = {
  compiler: {
    prebundle: {
      exclude: ['tarojs-router-next'],
    },
  },
}
```

## 小程序启动进入的第一个页面没有走路由中间件？

只有 Router.toXX 和 Router.navigate 方法会走路由中间件。

因此，一种最佳实践是：只提供一个入口页面，再在该入口页面通过入参判断引导到其他页面。

比如只提供一个入口页面为 pages/launch/index，当需要分享内容出去的时候：

```typescript
// 分享用户详情页
useShareAppMessage(() => ({
  title: `${user.nickname}`,
  path: `pages/launch/index?type=user&id=${user.id}`,
}))

// 分享文章
useShareAppMessage(() => ({
  title: `${article.title}`,
  path: `pages/launch/index?type=article&id=${article.id}`,
}))
```

然后再在 launch 页通过 type 进行页面重定向：

```typescript
const params = Router.getParams()

if (params.type === 'user') {
  Router.toUser({ params, type: NavigateType.redirectTo })
} else if (params.type === 'article') {
  Router.toArticle({ params, type: NavigateType.redirectTo })
} else {
  Router.toHome({ type: NavigateType.redirectTo })
}
```

## 关于路由方法生成

开发模式会为主包 `src/pages` 下的页面和各分包配置的 `pagePath` 下的页面生成路由方法，而生产模式仅为 `app.config.ts/js` 中注册的页面生成路由方法

## pages/xxx/index 页面不存在

出现这种情况一般是因为页面文件名非 `index.tsx / index.jsx / index.vue`，建议修改页面文件名为 `index`
