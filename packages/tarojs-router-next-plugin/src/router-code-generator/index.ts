import { IPluginContext } from '@tarojs/service'
import path from 'path'
import { IConfig } from '../config'
import { Generator } from './generate'
import { Parser } from './parse/index'

export class RouterCodeGenerator {
  private parser: Parser
  private generator: Generator
  private appConfigPath: string
  private appConfig: {
    pages: string[]
    subpackages?: {
      root: string
      pages: string[]
    }[]
    window: any
  }

  constructor(private readonly ctx: IPluginContext, private config: IConfig) {
    this.initAppConfig()
    this.parser = new Parser(ctx, config)
    this.generator = new Generator(ctx, config)
    this.config = Object.assign({ watch: true }, this.config)
  }

  initAppConfig() {
    this.appConfigPath = this.ctx.helper.resolveMainFilePath(path.resolve(this.ctx.paths.sourcePath, './app.config'))
    this.appConfig = this.ctx.helper.readConfig(this.appConfigPath)
  }

  listenBuildStart() {
    this.ctx.onBuildStart(() => {
      this.start()
      if (this.config.watch && this.ctx.runOpts.options.isWatch) this.watch()
    })
    return this
  }

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

  watch() {
    const { ctx } = this
    console.log(ctx.helper.chalk.gray('正在监听页面变化自动生成 Router...'))
    let timer: any
    const pagesPath = path.resolve(ctx.paths.sourcePath, 'pages')
    const start = () => {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        await this.start()
      }, 1000)
    }

    ctx.helper.chokidar.watch(pagesPath, { ignoreInitial: true }).on('addDir', start).on('unlinkDir', start)
    ctx.helper.chokidar
      .watch('**/route.config.ts', {
        ignoreInitial: true,
      })
      .on('add', start)
      .on('change', start)
      .on('unlink', start)
  }

  async start() {
    const pages = this.parser.start()
    this.generator.start({ pages })
    return pages
  }
}
