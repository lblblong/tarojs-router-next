import { processTypeEnum } from '@tarojs/helper/dist/constants'
import fs from 'fs'
import path from 'path'
import { Project, SourceFile } from 'ts-morph'
import { IConfigPackage } from './config'
import { ConfigPage, Page, RouteConfig } from './entitys'
import { Plugin } from './plugin'
import { extractValue, formatPageDir, isNil } from './utils'
import normalize from 'normalize-path'

export class Loader {
  project = new Project()
  configPages: ConfigPage[] = []
  appConfigPath: string
  appConfig: {
    pages: string[]
    subpackages?: any[]
    subPackages?: any[]
    window: any
  }

  constructor(private readonly root: Plugin) {
    // 非开发模式则读取 app.config.ts 中的配置，用于过滤未配置的页面
    if (!this.root.isWatch) this.loadConfigPages()
  }

  loadConfigPages(dynamic = false) {
    if (!dynamic && this.appConfig) return

    this.appConfigPath = this.root.helper.resolveMainFilePath(path.resolve(this.root.paths.sourcePath, './app.config'))
    this.appConfig = this.root.helper.readConfig(this.appConfigPath)

    for (const page of this.appConfig.pages) {
      this.configPages.push({
        path: page,
        packageName: 'main',
        packageRoot: '',
        fullPath: path.resolve(this.root.paths.sourcePath, page)
      })
    }

    for (const pkg of this.appConfig.subpackages || this.appConfig.subPackages || []) {
      if (!pkg.name) {
        this.root.log(
          processTypeEnum.WARNING,
          `请为分包 ${pkg.root} 配置 name 字段，请参考：http://lblblib.gitee.io/tarojs-router-next/guide/quike/subpackage`
        )
        continue
      }

      for (const page of pkg.pages) {
        this.configPages.push({
          path: page,
          packageName: pkg.name,
          packageRoot: pkg.root,
          fullPath: path.resolve(this.root.paths.sourcePath, pkg.root, page)
        })
      }
    }
  }

  loadPages() {
    this.root.pages = []
    for (const pkg of this.root.config.packages) {
      const routeConfigSourceFiles = this.project.addSourceFilesAtPaths(pkg.pagePath + '/**/route.config.ts')

      fs.readdirSync(pkg.pagePath)
        // 过滤一些非页面文件夹
        .filter(pageDirName => this.root.config.ignore.indexOf(pageDirName) === -1)
        .forEach(pageDirName => {
          const fullPath = path.resolve(pkg.pagePath, pageDirName, 'index')
          if (!this.root.isWatch && this.configPages.findIndex(configPage => configPage.fullPath === fullPath) === -1) {
            return
          }

          const page = new Page()
          page.packageName = pkg.name
          page.dirName = pageDirName
          page.dirPath = path.resolve(pkg.pagePath, pageDirName)
          // 生成跳转路径 pages/xx/xx
          page.path = normalize(path.join(pkg.pagePath.replace(this.root.paths.sourcePath, ''), pageDirName, 'index'))
          page.fullPath = fullPath

          const sourceFile = routeConfigSourceFiles.find(sourceFile => {
            return path.normalize(sourceFile.compilerNode.fileName) === path.resolve(page.dirPath, 'route.config.ts')
          })

          if (sourceFile) {
            this.loadRouteConfig(page, sourceFile)
          }

          this.loadMethod(page)

          this.root.pages.push(page)
          this.root.log(
            processTypeEnum.GENERATE,
            `Router.${page.packageName === 'main' ? '' : page.packageName + '.'}${page.method?.name}`
          )
        })
    }
  }

  loadPage(pageDirPath: string, pkg: IConfigPackage) {
    const index = this.root.pages.findIndex(page => page.dirPath === pageDirPath)

    const isExist = fs.existsSync(pageDirPath)
    if (isExist) {
      if (index !== -1) {
        const page = this.root.pages[index]
        this.loadRouteConfig(page)
        this.loadMethod(page)
        this.root.log(
          processTypeEnum.MODIFY,
          `Router.${page.packageName === 'main' ? '' : page.packageName + '.'}${page.method?.name}`
        )
      } else {
        const page = new Page()
        page.packageName = pkg.name
        page.dirName = path.parse(pageDirPath).name
        page.dirPath = pageDirPath
        page.path = path.resolve(pageDirPath.replace(this.root.paths.sourcePath, ''), 'index')
        page.fullPath = path.resolve(pageDirPath, 'index')
        this.loadRouteConfig(page)
        this.loadMethod(page)
        this.root.pages.push(page)
        this.root.log(
          processTypeEnum.GENERATE,
          `Router.${page.packageName === 'main' ? '' : page.packageName + '.'}${page.method?.name}`
        )
      }
      return true
    } else {
      if (index !== -1) {
        const [page] = this.root.pages.splice(index, 1)
        this.root.log(
          processTypeEnum.UNLINK,
          `Router.${page.packageName === 'main' ? '' : page.packageName + '.'}${page.method?.name}`
        )
        return true
      } else {
        return false
      }
    }
  }

  loadRouteConfig(page: Page, configSourceFile?: SourceFile) {
    page.routeConfig = undefined
    const routeConfig: RouteConfig = {}

    if (!configSourceFile) {
      const configPath = path.resolve(page.dirPath, 'route.config.ts')
      if (!fs.existsSync(configPath)) return
      configSourceFile = this.project.getSourceFile(configPath)
      if (configSourceFile) {
        configSourceFile.refreshFromFileSystemSync()
      } else {
        configSourceFile = this.project.addSourceFileAtPath(configPath)
      }
    }

    configSourceFile.getExportedDeclarations().forEach((declarations, name) => {
      if (declarations.length > 1) return
      const declaration = declarations[0] as any
      switch (name) {
        case 'Params':
          routeConfig.params = `import('${path.resolve(page.dirPath, 'route.config')}').Params`
          break
        case 'Data':
          routeConfig.data = `import('${path.resolve(page.dirPath, 'route.config')}').Data`
          break
        case 'Ext':
          routeConfig.ext = extractValue({
            name,
            declaration
          })
          break
      }
    })

    page.routeConfig = routeConfig
  }

  loadMethod(page: Page) {
    const { routeConfig, dirName } = page

    let methodName = 'to' + formatPageDir(dirName)
    const methodBody = `return Router.navigate({ url: "${page.path}"${
      routeConfig?.ext ? ', ext: ' + routeConfig.ext : ''
    } }, options)`

    let method = `function (options) {${methodBody}}`

    let methodType: string

    if (!routeConfig || (isNil(routeConfig.params) && isNil(routeConfig.data))) {
      methodType = `<T = any>(options?: NavigateOptions) => Promise<T>`
      page.method = {
        name: methodName,
        type: methodType,
        value: method
      }
      return
    }

    const optionsType = ['NavigateOptions']

    if (routeConfig.params) {
      optionsType.push(`Params<${routeConfig.params}>`)
    }

    if (routeConfig.data) {
      optionsType.push(`Data<${routeConfig.data}>`)
    }

    const optionsTypeString = optionsType.join(' & ')
    methodType = `RequiredKeys<${optionsTypeString}> extends never ? <T = any>(options?: ${optionsTypeString}) => Promise<T> : <T = any>(options: ${optionsTypeString}) => Promise<T>`
    page.method = {
      name: methodName,
      type: methodType,
      value: method
    }
  }
}
