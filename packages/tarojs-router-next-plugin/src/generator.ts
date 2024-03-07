import { processTypeEnum } from '@tarojs/helper/dist/constants'
import * as path from 'path'
import { Project, SourceFile } from 'ts-morph'
import { Page } from './entitys'
import { Plugin } from './plugin'
import * as fs from 'fs'

export class Generator {
  project: Project
  routerSourceFile: SourceFile
  targetModulePath: string

  constructor(private readonly root: Plugin) {
    this.targetModulePath = path.resolve(this.root.ctx.paths.nodeModulesPath, 'tarojs-router-next')
    const tsConfigFilePath = path.resolve(this.targetModulePath, 'tsconfig.json')
    this.project = new Project({
      tsConfigFilePath,
    })
    this.routerSourceFile = this.project.addSourceFileAtPath(
      path.resolve(this.targetModulePath, './src/router/index.ts')
    )
  }

  emitTimer: NodeJS.Timeout

  emit(force = false) {
    clearTimeout(this.emitTimer)
    const _emit = () => {
      fs.rmSync(path.resolve(this.targetModulePath, './dist/router/index.js'), { recursive: true, force: true })
      fs.rmSync(path.resolve(this.targetModulePath, './dist/router/index.js.map'), { recursive: true, force: true })
      fs.rmSync(path.resolve(this.targetModulePath, './dist/router/index.d.ts'), { recursive: true, force: true })

      this.routerSourceFile.refreshFromFileSystemSync()

      const tempSourceFile = this.project.createSourceFile('temp.ts', (writer) => {
        writer.writeLine('type NoInfer<T> = T extends infer U ? U : never;')
        writer.writeLine('type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]')
        writer.writeLine('type Data<Q> = RequiredKeys<Q> extends never ? { data?: Q } : { data: Q }')
        writer.writeLine('type Params<P> = RequiredKeys<P> extends never ? { params?: P } : { params: P }')
        writer.writeLine('class Router {')

        writer.write(this.generateMethods())

        writer.writeLine('}')
      })

      const routerClass = this.routerSourceFile.getClass('Router')!
      const staticMembers = tempSourceFile.getClass('Router')!.getStaticMembers()
      this.routerSourceFile.addTypeAliases(tempSourceFile.getTypeAliases().map((m) => m.getStructure()))
      routerClass.addMembers(staticMembers.map((m) => m.getStructure() as any))

      this.routerSourceFile.emitSync()
      tempSourceFile.delete()
      this.root.log(processTypeEnum.REMIND, '👋 已成功生成')
    }

    if (force) {
      _emit()
    } else {
      this.emitTimer = setTimeout(_emit, 300)
    }
  }

  generateMethods() {
    let methodText = ''
    let packages = this.root.pages.reduce((store, page) => {
      let pages = store.get(page.packageName)
      if (!pages) {
        pages = []
        store.set(page.packageName, pages)
      }
      pages.push(page)
      return store
    }, new Map<string, Page[]>())

    for (const packageName of packages.keys()) {
      const pages = packages.get(packageName)
      if (packageName === 'main') {
        methodText += pages
          ?.map((page) => {
            return `static ${page.method?.name}: ${page.method?.type} = ${page.method?.value}`
          })
          .join('\n\n')
      } else {
        methodText += `
        static ${packageName}: {
          ${pages
            ?.map((page) => {
              return `${page.method?.name}: ${page.method?.type}`
            })
            .join(';\n')}
        } = {
          ${pages
            ?.map((page) => {
              return `${page.method?.name}: ${page.method?.value}`
            })
            .join(',\n')}
        }
        `
      }
    }

    return methodText
  }
}
