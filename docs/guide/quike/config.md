## 关闭自动生成 Router.to\*\*

如果要关闭自动生成 [Router.to\*\*](/api/class/router#to-options-) ，需要修改配置项 `watch` 为 `false：`

```javascript | pure
/**
 * title: /config/index.js
 */

const config = {
  plugins: [
    [
      'tarojs-router-next-plugin',
      {
        watch: false,
      },
    ],
  ],
}
```

禁用自动生成后可通过如下命令生成 `Router` 的路由方法：

```shell
$ taro router-gen
# 启用监听文件夹变化自动生成
$ taro router-gen --watch
```

可将该命令添加到 package 的 script 中方便使用

```json
{
  "scripts": {
    "router-gen": "taro router-gen --watch"
  }
}
```
