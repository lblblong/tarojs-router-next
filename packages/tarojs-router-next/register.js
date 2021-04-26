const { PageData } = require("tarojs-router-next/dist/page-data")
const Taro = require("@tarojs/taro")
const qs = require('querystring')


if (typeof document !== "undefined") {
  let time, TAROJS_ROUTER_NEXT_FLAG = "__tarojs_router_next_flag__"

  function getCurrentInstance() {
    let count = 20
    const query = { ...{ route_key: undefined }, ...qs.parse(window.location.href.split('?')[1]) }
    return new Promise((ok, fail) => {
      time = setInterval(() => {
        if (count-- === 0) {
          clearInterval(time)
          fail(Error('获取当前页面超时'))
          return
        }
        const cur_route_key = Taro.getCurrentInstance().router?.params?.route_key
        if (query.route_key == cur_route_key) {
          ok(Taro.getCurrentInstance())
          clearInterval(time)
        }
      }, 20)
    })
  }

  window.addEventListener("hashchange", async () => {
    clearInterval(time)
    const { page, router } = await getCurrentInstance()

    if (!page || page[TAROJS_ROUTER_NEXT_FLAG]) return
    page[TAROJS_ROUTER_NEXT_FLAG] = true

    const originOnUnload = page.onUnload
    page.onUnload = function () {
      // 由于 router和 page 在 onHide 生命周期被抹除，在这里还原
      const instance = window.getCurrent()
      instance.router = router
      instance.page = page
      originOnUnload && originOnUnload.apply(this)
      PageData.emitBack()
      instance.router = null
      instance.page = null
    }
  })
} else {
  const originApp = App
  App = function (config) {
    const originOnLaunch = config.onLaunch
    config.onLaunch = function () {
      const originPage = Page
      Page = function (config) {
        const originOnUnload = config.onUnload
        config.onUnload = function () {
          if (originOnUnload) originOnUnload.apply(this)
          PageData.emitBack()
        }
        return originPage(config)
      }
      if (originOnLaunch) originOnLaunch.apply(this)
    }
    return originApp(config)
  }
}
