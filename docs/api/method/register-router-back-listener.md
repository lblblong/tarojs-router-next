---
title: registerRouterBackListener
order: 3
group:
  order: 2
  title: 方法
---

# registerRouterBackListener

注册全局路由返回监听

方法定义：

`registerRouterBackListener(listener: RouterBackListener): void`

参数：

1. `listener` 监听函数

## 注册全局路由返回监听

```typescript
import { registerRouterBackListener } from 'tarojs-router-next'

registerRouterBackListener((to, from) => {
  console.log(`全局监听页面返回：从 ${from.url} 返回到 ${to.url}`)
})

```