---
title: 介绍
---

# 介绍

tarojs-router-next 是 [Taro(小程序)](https://taro-docs.jd.com/taro/docs/README/index.html) 的路由解决方案

## 解决什么问题

1. 路由跳转的页面 url 没有类型提示容易输错
2. 路由传参需要手动拼接参数、无法携带任意类型、任意大小的数据
3. Taro(小程序) 的路由方法是异步的，页面数据传递需要通过 `EventCannal` 传递，不够简单
4. 路由跳转的鉴权等实现起来比较麻烦

## 如何解决

**1. 路由跳转的页面 url 没有类型提示容易输错**

tarojs-router-next 不需要使用者手写页面 url，它会监听项目 `src/pages` 内容变化，自动为使用者生成对应的路由方法并附加到 [Router](/api/class/router) 类上，比如以下列子：

左边的页面结构会生成右边的 [Router.to**](/api/class/router#to-options-) 系列方法，全都挂在 [Router](/api/class/router) 类上

![](/images/code1.png)

**2. 路由传参需要手动拼接参数、无法携带任意类型、任意大小的数据**

tarojs-router-next 允许直接传递一个对象给 `params`，它会把 `params` 展开拼接到 `url` 后面。并且还可以接收一个 `data` 参数，`data` 可以传递任意类型、任意大小的数据。

![](/images/code2.gif)

**3. Taro(小程序) 的路由方法是异步的，页面数据传递需要通过 EventCannal 传递，不够简单**

tarojs-router-next 的路由跳转会返回一个 `Promise`，通过 `async/await `可以写出同步的写法，详细参考 [同步的路由方法](/guide/quike/sync-router)

**4. 路由跳转的鉴权等实现起来比较麻烦**

自己实现路由的鉴权是比较麻烦的事情，而 tarojs-router-next 提供非常易于理解的路由中间件功能，详细参考 [路由中间件](/guide/quike/middleware)
