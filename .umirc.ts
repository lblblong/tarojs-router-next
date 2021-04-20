import { defineConfig } from 'umi'

export default defineConfig({
  logo: '/logo.png',
  title: ' ',
  description: '最好的taro，小程序路由解决方案',
  mode: 'site',
  exportStatic: {},
  base: process.env.NODE_ENV === 'production' ? '/tarojs-router-next/' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? '/tarojs-router-next/' : '/',
  navs: [
    {
      title: '使用指南',
      path: '/guide',
    },
    {
      title: 'API文档',
      path: '/api',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/lblblong/tarojs-router-next',
    },
  ],
})
