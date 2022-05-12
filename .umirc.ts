import { defineConfig } from 'umi'

export default defineConfig({
  logo: '/tarojs-router-next/logo.png',
  favicon: '/tarojs-router-next/favicon.ico',
  title: ' ',
  description: '可能是最好的 Taro 小程序路由库',
  mode: 'site',
  exportStatic: {},
  base: '/tarojs-router-next',
  publicPath: '/tarojs-router-next/',
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
      title: '示例',
      children: [
        { title: '查看代码', path: 'https://github.com/lblblong/tarojs-router-next/tree/master/examples' },
        { title: '开发者工具打开', path: 'https://developers.weixin.qq.com/s/2CcFkJmo7Dpb' },
      ],
    },
    {
      title: 'GitHub',
      path: 'https://github.com/lblblong/tarojs-router-next',
    },
  ],
  menus: {
    '/guide': [
      {
        title: '快速开始',
        children: [
          {
            title: '介绍',
            path: '/guide',
          },
          {
            title: '安装及使用',
            path: '/guide/quike/start',
          },
          {
            title: '路由跳转',
            path: '/guide/quike/navigate',
          },
          {
            title: '路由传参',
            path: '/guide/quike/params',
          },
          {
            title: '同步的路由方法',
            path: '/guide/quike/sync-router',
          },
          {
            title: '路由回退监听',
            path: '/guide/quike/router-back-listener',
          },
          {
            title: '路由中间件',
            path: '/guide/quike/middleware',
          },
          {
            title: '路由配置',
            path: '/quike/route-config',
          },
          {
            title: '分包支持',
            path: '/guide/quike/subpackage',
          },
          {
            title: '常见问题',
            path: '/guide/quike/qa',
          },
          {
            title: '插件配置',
            path: '/guide/quike/config',
          },
        ],
      },
      {
        title: '场景案例',
        children: [
          {
            title: '路由权限中间件',
            path: '/guide/scenes/middleware-auth',
          },
          {
            title: '跨页面取值',
            path: '/guide/scenes/value-across-page',
          },
        ],
      },
    ],
    '/api': [
      {
        title: '类',
        children: [
          {
            title: 'Router',
            path: '',
          },
        ],
      },
      {
        title: '方法',
        children: [
          {
            title: 'registerMiddleware',
            path: '/api/method/register-middleware',
          },
          {
            title: 'registerMiddlewares',
            path: '/api/method/register-middlewares',
          },
          {
            title: 'registerRouterBackListener',
            path: '/api/method/register-router-back-listener',
          },
        ],
      },
      {
        title: '其他',
        path: '/api/other',
      },
    ],
  },
  analytics: {
    baidu: '86dd7440f66d97b070760cdd2d2b1312',
  },
})
