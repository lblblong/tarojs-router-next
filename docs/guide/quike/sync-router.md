---
title: 同步的路由方法
order: 4
group:
  title: 快速开始
---

# 同步的路由方法

我们经常需要在返回到当前页面时做一些操作，思考一下以下场景在 Taro 中如何实现：

- 在编辑页跳转到选择城市页面选择一个城市，然后返回赋值给编辑页的表单项
- 在文章列表页点击其中一项进入到编辑页，编辑完成后返回数据给上一个页面局部更新，取消编辑则不做操作




## 之前的实现方式：EventChannel

通过 [EventChannel](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html#%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81) 建立页面通讯，在选择城市页面先获取 `eventChannel`，然后通过 `emit` 方法发送数据到到上一个页面注册的事件回调方法中，然后再调用 `Taro.
navigateBack` 返回编辑页

***不好的地方：事件的回调方法可读性差、耦合度高、只能在回调内部处理异常，并且需要目标页面配合写 event***



## 好的实现方式：同步的路由方法调用

在 tarojs-router-next 中，所有路由跳转都变成了同步方法，比如：

```tsx | pure
// page/edit/index
try {
  // 跳转页面选择城市
  const cityData = await Router.toSelectCity()
  if( !cityData ) return
  // 赋值给表单项
  this.form.city = cityData
} catch ( err ) {
  console.log( err.message )
}

// page/select-city/index
Router.back() // 返回上一个页面，此时上一个页面拿到的是 null
Router.back( { id: 1, name: '深圳' } ) // 返回上一个页面并返回城市数据
Router.back( new Error('用户取消选择') ) // 返回上一个页面并抛出异常
```

taro-router-next 的路由跳转方法会返回一个 `Promise`，该 `Promise` 对象会同时传递给跳转的目标页面， 使用 **Router.back** 即可通过 `Promise` 返回或抛出异常给上一个页面

