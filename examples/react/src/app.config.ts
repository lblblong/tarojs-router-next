export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/page-data/index',
    'pages/page-params/index',
    'pages/page-data-params/index',
    'pages/sel-city/index',
    'pages/me/index',
    'pages/login/index',
    'pages/class-demo/index',
  ],
  subpackages: [
    {
      name: 'packageA',
      root: 'packageA',
      pagesPath: 'packageA/pages',
      pages: ['pages/cat/index', 'pages/dog/index'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
})
