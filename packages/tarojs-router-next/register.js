const { PageData } = require('tarojs-router-next/dist/page-data')

const originApp = App
App = function (config) {
  const originOnLaunch = config.onLaunch
  config.onLaunch = function () {
    const originPage = Page
    Page = function (config) {
      const originOnUnload = config.onUnload
      config.onUnload = function () {
        PageData.emitBack()
        if (originOnUnload) originOnUnload.apply(this)
      }
      return originPage(config)
    }
    if (originOnLaunch) originOnLaunch.apply(this)
  }
  return originApp(config)
}
