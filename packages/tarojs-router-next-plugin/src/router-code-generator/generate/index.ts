import * as path from 'path'
import { Project, SourceFile } from 'ts-morph'
import { RouterCodeGenerator } from '..'
import { PackageConfig } from '../entites/package'
import { Page } from '../entites/page'
import { formatPageDir } from '../util'

export class Generator {
  project: Project
  routerSourceFile: SourceFile
  targetModulePath: string

  constructor(private readonly root: RouterCodeGenerator) {
    this.targetModulePath = path.resolve(this.root.ctx.paths.nodeModulesPath, 'tarojs-router-next')
    const tsConfigFilePath = path.resolve(this.targetModulePath, 'tsconfig.json')
    this.project = new Project({
      tsConfigFilePath,
    })
    this.routerSourceFile = this.project.addSourceFileAtPath(
      path.resolve(this.targetModulePath, './src/router/index.ts')
    )
  }

  start() {
    this.routerSourceFile.refreshFromFileSystemSync()

    const methodSourceFile = this.project.createSourceFile('methods.ts', (writer) => {
      writer.writeLine('type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]')
      writer.writeLine('type Data<Q = any> = RequiredKeys<Q> extends never ? { data?: Q } : { data: Q }')
      writer.writeLine('type Params<P = any> = RequiredKeys<P> extends never ? { params?: P } : { params: P }')
      writer.writeLine('class Router {')

      for (const pkg of this.root.packageConfigs) {
        const methods = this.generateMethods(pkg)
        writer.write(methods)
      }

      writer.writeLine('}')
    })

    const routerClass = this.routerSourceFile.getClass('Router')!
    const staticMembers = methodSourceFile.getClass('Router')!.getStaticMembers()
    this.routerSourceFile.addTypeAliases(methodSourceFile.getTypeAliases().map((m) => m.getStructure()))
    routerClass.addMembers(staticMembers.map((m) => m.getStructure() as any))

    this.routerSourceFile.emitSync()
    methodSourceFile.delete()
  }

  generateMethods(pkg: PackageConfig) {
    pkg.pages.forEach((page) => this.generateTsMethod({ page }))

    // 生产模式只为已注册的页面生成
    const filterHandler = (p: Page) => {
      if (this.root.isWatch) return true
      return !!p.config
    }

    if (pkg.name === 'main') {
      // 主包直接挂载为 Router 类静态方法
      pkg.methods = pkg.pages
        .filter(filterHandler)
        .map((p) => {
          return `static ${p.methodName}: ${p.methodType} = ${p.method}`
        })
        .join('\n\n')
    } else {
      // 子包路由方法挂载在 Router.[包名] 下
      pkg.methods = `
      static ${pkg.name}: {
        ${pkg.pages
          .filter(filterHandler)
          .map((p) => {
            return `${p.methodName}: ${p.methodType}`
          })
          .join(',\n')}
      } = {
          ${pkg.pages
            .filter(filterHandler)
            .map((p) => {
              return `${p.methodName}: ${p.method}`
            })
            .join(',\n')}
        }
      `
    }
    return pkg.methods
  }

  generateTsMethod(options: { page: Page }) {
    const { page } = options
    const { query, dir } = page

    page.methodName = 'to' + formatPageDir(dir)
    const methodBody = `return Router.navigate({ url: "/${page.path}"${
      page.query?.ext ? ', ext: ' + page.query.ext : ''
    } }, options)`

    page.method = `function (options) {${methodBody}}`

    if (!query) {
      page.methodType = `<T = any>(options?: NavigateOptions) => Promise<T>`
      return page
    }

    const optionsType = ['NavigateOptions']

    if (query.params) {
      optionsType.push(`Params<${query.params.text}>`)
    }

    if (query.data) {
      optionsType.push(`Data<${query.data.text}>`)
    }

    const optionsTypeString = optionsType.join(' & ')
    page.methodType = `RequiredKeys<${optionsTypeString}> extends never ? <T = any>(options?: ${optionsTypeString}) => Promise<T> : <T = any>(options: ${optionsTypeString}) => Promise<T>`
    return page
  }
}
