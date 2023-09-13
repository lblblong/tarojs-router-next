import { defineConfig } from 'dumi'

export default defineConfig({
  logo: '/tarojs-router-next/logo.png',
  favicons: ['/tarojs-router-next/favicon.ico'],
  exportStatic: {},
  base: '/tarojs-router-next',
  publicPath: '/tarojs-router-next/',
  themeConfig: {
    sidebar: {
      '/guide': [
        {
          title: '快速开始',
          children: [
            {
              title: '介绍',
              link: '/guide',
            },
            {
              title: '安装及使用',
              link: '/guide/quike/start',
            },
            {
              title: '路由跳转',
              link: '/guide/quike/navigate',
            },
            {
              title: '路由传参',
              link: '/guide/quike/params',
            },
            {
              title: '同步的路由方法',
              link: '/guide/quike/sync-router',
            },
            {
              title: '路由回退监听',
              link: '/guide/quike/router-back-listener',
            },
            {
              title: '路由中间件',
              link: '/guide/quike/middleware',
            },
            {
              title: '路由配置',
              link: '/guide/quike/route-config',
            },
            {
              title: '分包支持',
              link: '/guide/quike/subpackage',
            },
            {
              title: '常见问题',
              link: '/guide/quike/qa',
            },
            {
              title: '插件配置',
              link: '/guide/quike/config',
            },
          ],
        },
        {
          title: '场景案例',
          children: [
            {
              title: '路由权限中间件',
              link: '/guide/scenes/middleware-auth',
            },
            {
              title: '跨页面取值',
              link: '/guide/scenes/value-across-page',
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
              link: '/api/router',
            },
          ],
        },
        {
          title: '方法',
          children: [
            {
              title: 'registerMiddleware',
              link: '/api/register-middleware',
            },
            {
              title: 'registerMiddlewares',
              link: '/api/register-middlewares',
            },
            {
              title: 'registerRouterBackListener',
              link: '/api/register-router-back-listener',
            },
          ],
        },
        {
          title: '其他',
          children: [
            {
              title: '类型',
              link: '/api/other',
            },
          ],
        },
      ],
    },
    nav: [
      {
        title: '使用指南',
        link: '/guide',
      },
      {
        title: 'API文档',
        link: '/api/router',
      },
      {
        title: '（示例项目）',
        children: [
          { title: '查看代码', link: 'https://github.com/lblblong/tarojs-router-next/tree/master/examples' },
          { title: '开发者工具打开', link: 'https://developers.weixin.qq.com/s/2CcFkJmo7Dpb' },
        ],
      },
      {
        title: 'GitHub',
        link: 'https://github.com/lblblong/tarojs-router-next',
      },
    ],
  },
  analytics: {
    baidu: '86dd7440f66d97b070760cdd2d2b1312',
  },
})
