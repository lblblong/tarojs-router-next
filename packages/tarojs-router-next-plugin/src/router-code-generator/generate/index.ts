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
      writer.writeLine('class Router {')

      for (const pkg of this.root.packageConfigs) {
        const methods = this.generateMethods(pkg)
        writer.write(methods)
      }

      writer.writeLine('}')
    })

    const routerClass = this.routerSourceFile.getClass('Router')!
    const staticMembers = methodSourceFile.getClass('Router')!.getStaticMembers()
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
          return `static ${p.methodName} = ${p.method}`
        })
        .join('\n\n')
    } else {
      // 子包路由方法挂载在 Router.[包名] 下
      pkg.methods = `
      static ${pkg.name} = {
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

    if (!query) {
      page.method = `function (options?: NavigateOptions){${methodBody}}`
      return page
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

    page.method = `function (options${optionsOptional ? '?' : ''}: ${optionsType.join(' & ')}){${methodBody}}`
    return page
  }
}
