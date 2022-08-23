## v2.9.0 (2022-08-23)
- 优化路由方法的类型生成，提升生成速度

## v2.8.1 (2022-04-12)
- Router.back 方法允许多层页面回退

## v2.7.2 (2022-02-10)
- 更新 taro 依赖版本至 3.4.1
- 切换包管理为 pnpm

## v2.7.1 (2021-10-26)
- 修复 [setBackResult](http://lblblib.gitee.io/tarojs-router-next/api/class/router#setbackresult-result-any-) 非静态方法问题

## v2.7.0 (2021-10-25)
- 新增设置页面返回数据方法：[setBackResult](http://lblblib.gitee.io/tarojs-router-next/api/class/router#setbackresult-result-any-)

## v2.6.0 (2021-10-16)
- 新增全局监听路由返回功能：registerRouterBackListener

## v2.5.3 (2021-9-6)
- 修复to方法返回值类型问题

## v2.5.2 (2021-8-31)

- 更新文档

## v2.5.1 (2021-8-31)

- 为此前中间件访问 type 和 data 功能添加类型提示

## v2.5.0 (2021-8-31)

- 中间件逻辑修改为和 koa 完全一致

## v2.4.0 (2021-8-9)

- 添加中间件中访问跳转路由 type 和 data 的功能

## v2.3.1 (2021-6-25)

- 修复 h5 端第一次页面跳转第一个页面不隐藏问题

## v2.3.0 (2021-6-21)

- route_key 从 query 中隐藏
- 添加对 h5 自定义路由路径项目的支持

## v2.2.6 (2021-6-18)

- 修复 router-gen 不输出日志问题

## v2.2.5 (2021-6-3)

- 修复 Mac 环境下 .DS_Store 文件导致的问题

## v2.2.3 (2021-5-28)

- 优化代码生成速度

## v2.2.2 (2021-5-13)

- 修复默认 tarojs-router-next-plugin 默认非 watch 模式问题

## v2.2.1 (2021-5-13)

- 增加配置项 [watch](http://lblblib.gitee.io/tarojs-router-next/guide/quike/config#%E5%85%B3%E9%97%AD%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90-routerto) 可关闭自动生成

## v2.2.0 (2021-5-13)

- 增加分包支持
- 构建模式仅为已在 app.config.ts 注册的页面生成路由方法
