import fs from 'fs'
import path from 'path'
import { Project, SourceFile } from 'ts-morph'
import { RouterCodeGenerator } from '..'
import { PackageConfig } from '../entites/package'
import { Page } from '../entites/page'
import { PageQuery } from '../entites/page-query'
import { extractValue } from '../util'

export class Parser {
  constructor(private readonly root: RouterCodeGenerator) {}

  start() {
    for (const pkg of this.root.packageConfigs) {
      this.parse({ pkg })
    }
  }

  /** 解析传入包的所有路由方法 */
  parse(options: { pkg: PackageConfig }) {
    const { pkg } = options
    const project = new Project()

    const configSourceFiles = this.readConfigSourceFiles({ pkg, project })
    let pages = this.createPages({ pkg })

    for (const p of pages) {
      p.config = pkg.pageConfigs.find((it) => it.dir === p.dir)
    }

    for (const sourceFile of configSourceFiles) {
      const page = pages.find((p) => {
        return path.resolve(p.fullPath, 'route.config.ts') === path.normalize(sourceFile.compilerNode.fileName)
      })
      if (!page) continue
      this.parseSourceFile({
        page,
        project,
        sourceFile,
      })
    }

    pkg.pages = pages
  }

  /** 读取传入包的所有 route.config.ts 配置文件 */
  readConfigSourceFiles(options: { pkg: PackageConfig; project: Project }) {
    const { project } = options
    const { fullPagesPath } = options.pkg
    project.addSourceFilesAtPaths(fullPagesPath + '/**/route.config.ts')
    project.resolveSourceFileDependencies()
    return project.getSourceFiles().filter((it) => it.compilerNode.fileName.endsWith('route.config.ts'))
  }

  /** 为传入包页面路径下所有目录生成 Page 配置对象 */
  createPages(options: { pkg: PackageConfig }) {
    const { fullPagesPath, pagesPath } = options.pkg
    return (
      fs
        .readdirSync(fullPagesPath)
        // 过滤一些非页面文件夹
        .filter((d) => this.root.config.ignore.indexOf(d) === -1)
        .map((d) => {
          const p = new Page()
          p.dir = d
          // 生成跳转路径 pages/xx/xx
          p.path = path.join(pagesPath, d, 'index').replace(/\\/g, '/')
          p.fullPath = path.resolve(fullPagesPath, d)
          return p
        })
    )
  }

  /** 解析 route.config.ts 导出的 Params、Data、Ext */
  parseSourceFile(options: { page: Page; project: Project; sourceFile: SourceFile }) {
    const { page, sourceFile } = options

    const pageQuery: PageQuery = {}

    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      if (declarations.length > 1) return
      const declaration = declarations[0] as any
      switch (name) {
        case 'Params':
          pageQuery.params = {
            name,
            text: `import('${page.fullPath}/route.config').Params`,
          }
          break
        case 'Data':
          pageQuery.data = {
            name,
            text: `import('${page.fullPath}/route.config').Data`,
          }
          break
        case 'Ext':
          pageQuery.ext = extractValue({
            name,
            declaration,
          })
          break
      }
    })

    page.query = pageQuery

    return page
  }
}
