import { registerRouterBackListener } from 'tarojs-router-next'
import './middleware'

registerRouterBackListener((to, from) => {
  console.log(`全局监听页面返回：从 ${from.url} 返回到 ${to.url}`)
})
