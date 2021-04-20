import { IPluginContext } from '@tarojs/service'
import * as path from 'path'
import { IConfig } from 'src/config'
import { Project, SourceFile } from 'ts-morph'
import { Page } from '../entites/page'
import { formatPageDir } from '../util'

export class Generator {
  project: Project
  routerSourceFile: SourceFile
  targetModulePath: string

  constructor(private readonly ctx: IPluginContext, private config: IConfig) {
    this.targetModulePath = path.resolve(this.ctx.paths.nodeModulesPath, 'tarojs-router-next')
    const tsConfigFilePath = path.resolve(this.targetModulePath, 'tsconfig.json')
    this.project = new Project({
      tsConfigFilePath,
    })
    this.routerSourceFile = this.project.addSourceFileAtPath(
      path.resolve(this.targetModulePath, './src/router/index.ts')
    )
  }

  start(options: { pages: Page[] }) {
    this.routerSourceFile.refreshFromFileSystemSync()

    const methods = options.pages.map((p) => this.generateTsMethod(p)).join('\n')

    const methodSourceFile = this.project.createSourceFile('methods.ts', (writer) => {
      writer.writeLine('class Router {').write(methods).writeLine('}')
    })
    const routerClass = this.routerSourceFile.getClass('Router')!
    const ms = methodSourceFile.getClass('Router')!.getStaticMethods()
    routerClass.addMethods(ms.map((m) => m.getStructure() as any))

    ms.forEach((m) => {
      console.log(`生成方法：Router.${m.getName()}`)
    })

    this.routerSourceFile.emitSync()
    methodSourceFile.delete()
  }

  generateTsMethod(p: Page) {
    const { query, dir } = p

    const methodName = 'to' + formatPageDir(dir)
    const methodBody = `return Router.navigate({ url: "/pages/${dir}/index"${
      p.query?.ext ? ', ext: ' + p.query.ext : ''
    } }, options)`

    if (!query) {
      return `static ${methodName}(options?: NavigateOptions){${methodBody}}`
    }

    const optionsType = ['NavigateOptions']
    let optionsOptional = true

    if (query.params) {
      if (query.params.optional) {
        optionsType.push(`{ params?: ${query.params.text} }`)
      } else {
        optionsOptional = false
        optionsType.push(`{ params: ${query.params.text} }`)
      }
    }

    if (query.data) {
      if (query.data.optional) {
        optionsType.push(`{ data?: ${query.data.text} }`)
      } else {
        optionsOptional = false
        optionsType.push(`{ data: ${query.data.text} }`)
      }
    }

    return `static ${methodName}(options${optionsOptional ? '?' : ''}: ${optionsType.join(' & ')}){${methodBody}}`
  }
}
