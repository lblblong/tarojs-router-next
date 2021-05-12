import fs from 'fs'
import path from 'path'
import { Project, SourceFile } from 'ts-morph'
import { RouterCodeGenerator } from '..'
import { PackageConfig } from '../entites/package'
import { Page } from '../entites/page'
import { extractType, extractValue } from '../util'
import { QueryMeta } from './type'

export class Parser {
  constructor(private readonly root: RouterCodeGenerator) {}

  start() {
    for (const pkg of this.root.packageConfigs) {
      this.parse({ pkg })
    }
  }

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

  readConfigSourceFiles(options: { pkg: PackageConfig; project: Project }) {
    const { project } = options
    const { fullPagesPath } = options.pkg
    project.addSourceFilesAtPaths(fullPagesPath + '/**/route.config.ts')
    project.resolveSourceFileDependencies()
    return project.getSourceFiles().filter((it) => it.compilerNode.fileName.endsWith('route.config.ts'))
  }

  createPages(options: { pkg: PackageConfig }) {
    const { fullPagesPath, pagesPath } = options.pkg
    return fs.readdirSync(fullPagesPath).map((d) => {
      const p = new Page()
      p.dir = d
      p.path = path.join(pagesPath, d, 'index').replace(/\\/g, '/')
      p.fullPath = path.resolve(fullPagesPath, d)
      return p
    })
  }

  parseSourceFile(options: { page: Page; project: Project; sourceFile: SourceFile }) {
    const { page, project, sourceFile } = options
    const checker = project.getTypeChecker()

    const pageQuery: {
      params?: QueryMeta
      data?: QueryMeta
      ext?: string
    } = {}

    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      if (declarations.length > 1) return
      const declaration = declarations[0] as any
      switch (name) {
        case 'Params':
          pageQuery.params = extractType({
            name,
            declaration,
            checker,
          })
          break
        case 'Data':
          pageQuery.data = extractType({
            name,
            declaration,
            checker,
          })
          break
        case 'Ext':
          pageQuery.ext = extractValue({
            name,
            declaration,
            checker,
          })
          break
      }
    })

    page.query = pageQuery

    return page
  }
}
