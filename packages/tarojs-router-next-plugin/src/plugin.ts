import { processTypeEnum } from '@tarojs/helper'
import { IPluginContext } from '@tarojs/service'
import { IPaths } from '@tarojs/service/src/utils/types'
import path from 'path'
import { IConfig, IConfigPackage } from './config'
import { Page } from './entitys'
import { Generator } from './generator'
import { Loader } from './loader'

export class Plugin {
  loader: Loader
  generator: Generator
  isWatch: boolean
  paths: IPaths
  helper: typeof import('@tarojs/helper')

  pages: Page[] = []

  constructor(public readonly ctx: IPluginContext, public config: IConfig) {
    this.helper = this.ctx.helper
    this.paths = this.ctx.paths

    this.config.packages = this.config.packages ?? []
    if (this.config.packages.findIndex(pkg => pkg.name === 'main') === -1) {
      this.config.packages.push({
        name: 'main',
        pagePath: path.resolve(this.paths.sourcePath, 'pages')
      })
    }
    this.config.ignore = this.config.ignore ?? ['.DS_Store']

    this.isWatch = !!(this.ctx.runOpts.options.isWatch || this.ctx.runOpts.options.watch)
    this.loader = new Loader(this)
    this.generator = new Generator(this)
  }

  onBuildStart() {
    this.ctx.onBuildStart(() => this.start())
    return this
  }

  registerCommand() {
    const { ctx } = this
    ctx.registerCommand({
      name: 'router-gen',
      optionsMap: {
        '--watch': '监听页面信息变化自动生成 Router'
      },
      synopsisList: ['taro router-gen 生成 Router', 'taro router-gen --watch 监听页面信息变化自动生成 Router'],
      fn: () => this.start()
    })
    return this
  }

  watch() {
    const { ctx } = this
    this.log(processTypeEnum.REMIND, '正在监听页面变化自动生成 Router.to...')
    const loadPge = (pageDirPath: string, pkg: IConfigPackage) => {
      if (this.loader.loadPage(pageDirPath, pkg)) this.generator.emit()
    }

    for (const pkg of this.config.packages) {
      const onChange = (value: string) => {
        if (value.endsWith('route.config.ts')) value = value.replace('/route.config.ts', '')
        loadPge(value, pkg)
      }

      ctx.helper.chokidar
        .watch(pkg.pagePath, { ignoreInitial: true, depth: 0 })
        .on('addDir', onChange)
        .on('unlinkDir', onChange)

      ctx.helper.chokidar
        .watch(path.resolve(pkg.pagePath, '**/route.config.ts'), {
          ignoreInitial: true,
          depth: 1
        })
        .on('add', onChange)
        .on('change', onChange)
        .on('unlink', onChange)
    }
  }

  start() {
    try {
      this.log(processTypeEnum.START, '正在生成路由方法...')
      this.loader.loadPages()
      this.generator.emit(true)
      if (this.isWatch) this.watch()
    } catch (err) {
      this.log(
        processTypeEnum.ERROR,
        '路由方法生成失败，请将以下错误反馈给我：https://github.com/lblblong/tarojs-router-next/issues'
      )
      console.log(err)
    }
  }

  log(type: processTypeEnum, text: string) {
    this.ctx.helper.printLog(type, text)
  }
}
