---
title: 路由回退监听
order: 5.1
group:
  title: 快速开始
---

# 路由回退监听

通过 [registerRouterBackListener](/api/method/register-router-back-listener) 方法全局监听路由回退事件

```typescript
import { registerRouterBackListener } from 'tarojs-router-next'

registerRouterBackListener((to, from) => {
  console.log(`全局监听页面返回：从 ${from.url} 返回到 ${to.url}`)
})

```