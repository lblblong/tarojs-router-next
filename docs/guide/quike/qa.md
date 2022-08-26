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

## 关于路由方法生成

开发模式会为主包 `src/pages` 下的页面和各分包配置的 `pagePath` 下的页面生成路由方法，而生产模式仅为 `app.config.ts/js` 中注册的页面生成路由方法

## pages/xxx/index 页面不存在

出现这种情况一般是因为页面文件名非 `index.tsx / index.jsx / index.vue`，建议修改页面文件名为 `index`
