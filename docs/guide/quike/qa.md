---
title: 常见问题
order: 98
group:
  title: 快速开始
---

# 常见问题

tarojs-router-next 对于大多数的项目都能正常运转，如果你的项目在使用过程中出现问题，请检查是否符合以下规范：

- 页面在 `src/pages` 一级目录下
- 页面文件名是 `index`，比如： `index.tsx / index.jsx / index.vue`
- 分包页面在 `pagesPath` 一级目录下

```typescript
export default {
  pages: [
    'pages/user/index', // 支持
    'pages/user/setting/index', // 不支持，非 pages 一级目录下
    'pages/user/user',  // 不支持，页面文件名不是 index
  ],
  subpackages: [
    {
      name: 'packageA',
      root: 'packageA',
      pagesPath: 'packageA/pages',
      pages: [
        'pages/cat/index', // 支持
        'pages/animal/dog/index'  // 不支持，非 packageA/pages 一级目录下
        'pages/cat/cat'  // 不支持，页面文件名不是 index
      ],
    }
  ],
}

```

## 关于路由方法生成

开发模式会为所有 `pages` 下的页面生成路由方法，而生产模式仅为 `app.config.ts/js` 中注册的页面生成路由方法

## pages 下的二级目录没有生成路由方法

目前 `tarojs-router-next-plugin` 只为 `pages` 下的一级目录生成路由方法，所以请不要在二级目录创建页面，

分包也是一样，仅为 `src/app.config.ts` 文件内 `subPackages` 中的 `pagesPath` 下的一级目录生成路由方法

## pages/xxx/index 页面不存在

出现这种情况一般是因为页面文件名非 `index.tsx / index.jsx / index.vue`，建议修改页面文件名为 `index`

## 自定义了 h5 路由路径，是否支持

自定义了 h5 端路由路径后，同步的路由方法将无法生效。
其他问题暂未可知，能不自定义 h5 路径尽量不要自定义。
