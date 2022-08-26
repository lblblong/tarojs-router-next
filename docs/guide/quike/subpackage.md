# 分包支持

`tarojs-router-next-plugin` 默认只会为 `src/pages` 目录下的页面生成路由方法，当使用分包时需要进行额外的配置。

比如下面的代码中在 `app.config.ts` 配置的分包 `root` 为 `packageA`，页面都在 `src/packageA/pages` 目录下，则需要在 `config/index.js` 中为插件传入分包配置：

[![vRiXKx.png](https://s1.ax1x.com/2022/08/26/vRiXKx.png)](https://imgse.com/i/vRiXKx)

最右侧 `config/index.js` 红框中的 `packages` 则是分包配置，其中 `pagePath` 字段声明了分包的页面所在的文件夹路径，`name` 声明了分包的名字，最终会生成如下的分包路由方法：

- Router.packageA.toCat
- Router.packageA.toDot

> 注意: 右侧 `config/index.js` 分包配置中的 `name` 并非是要对应 `app.config.ts` 中配置的 `root` 或者 `name`，而是用于生成路由方法的（`Router.[name].toXX`），如果将 `name` 改为 `pkgb` 则会生成 `Router.pkgb.toCat` 和 `Router.pkgb.toDog`，**所以 `name` 的命名请不要包含除下划线以外的其他符号**

## 主包页面不在 `src/pages` 目录下

有时我们不想使用推荐的目录结构，比如我想把主包的页面放在 `src/views` 下，那么则需要进行如下的配置：

[![vRm6c4.png](https://s1.ax1x.com/2022/08/26/vRm6c4.png)](https://imgse.com/i/vRm6c4)

请注意，主包的 `name` 字段必须为 `main`，这样才会将主包路由方法直接挂载在 Router 类上。
