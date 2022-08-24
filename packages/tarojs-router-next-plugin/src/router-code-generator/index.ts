import { processTypeEnum } from '@tarojs/helper/dist/constants'
import { IPluginContext } from '@tarojs/service'
import path from 'path'
import { IConfig } from '../config'
import { PackageConfig } from './entites/package'
import { Generator } from './generate'
import { Parser } from './parse/index'

export class RouterCodeGenerator {
  parser: Parser
  generator: Generator
  appConfigPath: string
  appConfig: {
    pages: string[]
    subpackages?: any[]
    subPackages?: any[]
    window: any
  }
  packageConfigs: PackageConfig[]
  isWatch: boolean

  constructor(public readonly ctx: IPluginContext, public config: IConfig) {
    this.config = Object.assign({ watch: true, ignore: ['.DS_Store'] }, this.config)
    this.isWatch = this.config.watch && (this.ctx.runOpts.options.isWatch || this.ctx.runOpts.options.watch)
    this.initAppConfig()
    this.initPackageConfigs()
    this.parser = new Parser(this)
    this.generator = new Generator(this)
  }

  /** 读取 app.config.ts 信息 */
  initAppConfig() {
    this.appConfigPath = this.ctx.helper.resolveMainFilePath(path.resolve(this.ctx.paths.sourcePath, './app.config'))
    this.appConfig = this.ctx.helper.readConfig(this.appConfigPath)
  }

  /** 读取 app.config.ts 中主包和分包信息 */
  initPackageConfigs() {
    const createPackage = (options: { name: string; pagesPath: string; root: string; pagesConfig: string[] }) => {
      const pkg = new PackageConfig()
      pkg.name = options.name
      pkg.pagesPath = options.pagesPath
      pkg.fullPagesPath = path.resolve(this.ctx.paths.sourcePath, options.pagesPath)
      pkg.root = options.root
      pkg.pageConfigs = options.pagesConfig.map((it) => {
        const origin = it
        const dir = it.split('/')[it.split('/').length - 2]
        const fullPath = path.resolve(this.ctx.paths.sourcePath, options.root, it)
        return { origin, dir, fullPath }
      })
      return pkg
    }

    const mainPackage = createPackage({
      name: 'main',
      root: '',
      pagesConfig: this.appConfig.pages,
      pagesPath: 'pages',
    })
    const subPackages = (this.appConfig.subpackages || this.appConfig.subPackages || [])
      .filter((it) => {
        if (!it.pagesPath || !it.name) {
          this.ctx.helper.printLog(
            processTypeEnum.WARNING,
            `请为分包 ${it.root} 配置 pagesPath 和 name 字段，请参考：http://lblblib.gitee.io/tarojs-router-next/guide/quike/subpackage`
          )
          return false
        }
        return true
      })
      .map((it) =>
        createPackage({
          name: it.name,
          pagesConfig: it.pages,
          pagesPath: it.pagesPath,
          root: it.root,
        })
      )
    this.packageConfigs = [mainPackage, ...subPackages]
  }

  /** 监听 taro-cli 的 BuildStart 生命周期事件触发路由方法生成 */
  listenBuildStart() {
    this.ctx.onBuildStart(() => {
      this.start()
      if (this.isWatch) this.watch()
    })
    return this
  }

  /** 注册 taro router-gen 命名 */
  registerCommand() {
    const { ctx } = this
    ctx.registerCommand({
      name: 'router-gen',
      optionsMap: {
        '--watch': '监听页面信息变化自动生成 Router',
      },
      synopsisList: ['taro router-gen 生成 Router', 'taro router-gen --watch 监听页面信息变化自动生成 Router'],
      fn: async () => {
        const { watch } = ctx.runOpts.options
        this.start()
        if (watch) this.watch()
      },
    })
    return this
  }

  /** 监听 pages 下文件变化重新生成路由方法 */
  watch() {
    const { ctx } = this
    this.ctx.helper.printLog(processTypeEnum.REMIND, '正在监听页面变化自动生成 Router.to...')
    let timer: any
    const start = () => {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        await this.start()
      }, 1000)
    }

    for (const pkg of this.packageConfigs) {
      ctx.helper.chokidar
        .watch(path.resolve(ctx.paths.sourcePath, pkg.pagesPath), { ignoreInitial: true })
        .on('addDir', start)
        .on('unlinkDir', start)
    }

    ctx.helper.chokidar
      .watch('**/route.config.ts', {
        ignoreInitial: true,
      })
      .on('add', start)
      .on('change', start)
      .on('unlink', start)
  }

  async start() {
    try {
      this.ctx.helper.printLog(processTypeEnum.START, '正在生成路由方法...')
      this.parser.start()
      this.generator.start()
      this.printMethods()
      this.ctx.helper.printLog(processTypeEnum.REMIND, '生成完成')
    } catch (err) {
      this.ctx.helper.printLog(
        processTypeEnum.ERROR,
        '路由方法生成失败，请将以下错误反馈给我：https://github.com/lblblong/tarojs-router-next/issues'
      )
      console.log(err)
    }
  }

  /** 打印路由方法到控制台，仅 watch 模式打印 */
  printMethods() {
    if (!this.isWatch) return
    for (const pkg of this.packageConfigs) {
      for (const page of pkg.pages) {
        if (!page.config) continue
        this.ctx.helper.printLog(
          processTypeEnum.GENERATE,
          `Router.${pkg.name === 'main' ? '' : pkg.name + '.'}${page.methodName}`
        )
      }
    }
  }
}
