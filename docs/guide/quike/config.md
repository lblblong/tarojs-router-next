# 插件配置

`tarojs-router-next-plugin` 插件接受两个配置项：

- `ignore`：要忽略的文件夹
- `packages`：分包配置

## ignore

该项配置可以用于忽略一些不是页面的文件夹，比如 `src/pages` 目录下有一个 `api` 文件夹不是页面，那么向如下配置后就不会生成 `Router.toApi` 方法了：

```javascript
plugins: [
  [
    'tarojs-router-next-plugin',
    {
      ignore: ['api']
    }
  ]
]
```

## packages

具体使用参见 [分包支持](/guide/quike/subpackage)
