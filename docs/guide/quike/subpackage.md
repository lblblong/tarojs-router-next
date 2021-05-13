---
title: 分包支持
order: 8
group:
  title: 快速开始
---

# 分包支持

tarojs-router-next 支持为分包生成路由方法，只需在 `src/app.config.ts` 或 js 文件中的分包配置加入两个字段：

```typescript
export default {
  pages: ...,
  subpackages: [
    {
      name: 'packageA', <-- 这里
      pagesPath: 'packageA/pages', <-- 和这里
      root: 'packageA',
      pages: ['pages/cat/index', 'pages/dog/index'],
    }
  ]
}

```

生成如下路由方法：

- `Router.packageA.toCat`
- `Router.packageA.toDog`

## 字段说明

#### name

该字段是子包的名字，子包路由方法生成规则按照 `Router.[name].toXX`，所以 `name` 的值请不要包含特殊符号

#### pagesPath

该字段是子包页面所在的路径，一个相对 src 目录的相对路径

比如子包的页面都在 `src/packageA/pages` 目录下，则该值为 `packageA/pages`

如果子包页面都在 `src/pages_sub` 目录下，则该值为 `pages_sub`
